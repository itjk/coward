import { Versions, Discord } from "../../util/Constants.ts";
import { Bucket } from "./Bucket.ts";

export class RequestHandler {
  private static readonly userAgent =
    `DiscordBot (https://github.com/fox-cat/coward), ${Versions.THIS}`;
  private readonly rateLimitBuckets = new Map<string, Bucket>();
  public global = false;
  public globalReset = 0;

  constructor(private readonly botToken: string) {}

  private addQueue(
    func: Function,
    method: string,
    url: string,
  ): Promise<unknown> {
    const route = routify(method, url);
    let bucket = this.rateLimitBuckets.get(route);
    if (!bucket) {
      bucket = new Bucket();
      this.rateLimitBuckets.set(route, bucket);
    }
    return bucket.addQueue(func);
  }

  public request(
    method: string,
    url: string,
    data?: string | {
      file?: {
        file: File | Blob;
        name: string;
      };
      [key: string]: any;
    },
  ): Promise<unknown> {
    const headers: { [k: string]: string } = {
      "User-Agent": RequestHandler.userAgent,
      "Authorization": "Bot " + this.botToken,
      "X-Ratelimit-Precision": "millisecond",
    };

    const body = typeof data === "string"
      ? JSON.stringify({ content: data })
      : this.makeBody({ ...data }, headers) ?? undefined;

    const task = async (bucket: Bucket) =>
      this.requestWithAttempts(
        { url, init: { method, headers, body }, bucket },
      );
    return this.addQueue(
      task,
      method,
      url,
    );

    /** switch(response.status) {
			case 400: case 401: case 403: case 404: case 405: case 429:
			case 502: case 500: case 503: case 504: case 507: case 508:
				const json = await response.json();
				if(json.code)
					{ throw new Error(response.status + ", " + json.code + ", " + json.message); }
				else
					{ throw new Error(response.status + ", " + response.statusText); }
				break;
			case 204:
				return null;
				break;
			default:
				return response.json();
				break;
		
		}*/
  }

  private makeBody(
    data: {
      readonly [key: string]: unknown;
      file?: { file: File | Blob; name: string } | undefined;
    } | undefined,
    headers: { [k: string]: string },
  ): FormData | string | null {
    if (data == null) {
      return null;
    }
    if (data.file) {
      const form = new FormData();

      form.append("file", data.file.file, data.file.name);
      // console.log(data.file.file["Symbol"]);
      delete data.file;
      if (0 < Object.keys(data).length) {
        form.append("payload_json", new Blob([JSON.stringify(data)]));
      }
      return form;
    }
    headers["Content-Type"] = "application/json";
    return JSON.stringify(data);
  }

  private async requestWithAttempts(
    { url, init, bucket, attemptLimit = 3 }: {
      readonly url: string;
      readonly init?: RequestInit;
      readonly bucket: Bucket;
      readonly attemptLimit?: number;
    },
  ): Promise<unknown> {
    for (let attempts = 0; attempts < attemptLimit; ++attempts) {
      const response = await fetch(Discord.API + url, init);
      if (response.status == 204) return;

      if (response.ok) {
        bucket.applyHeadersToBucket(response.headers);
        return await response.json();
      }
      if (response.status == 429) {
        console.warn("Received a 429; :(");
        bucket.applyHeadersToBucket(response.headers);
      }
    }
    throw new Error(`Failed after ${attemptLimit} attempts.`);
  }
}

const idReplacer = (substring: string, p: unknown): string =>
  p === "channels" || p === "guilds" || p === "webhooks"
    ? substring
    : `/${p}/:id`;

function routify(method: string, url: string): string {
  const route = url
    .replace(/\/([a-z-]+)\/(?:[0-9]{17,19})/g, idReplacer)
    .replace(/\/reactions\/[^/]+/g, "/reactions/:id")
    .replace(/^\/webhooks\/(\d+)\/[A-Za-z0-9-_]{64,}/, "/webhooks/$1/:token")
    .replace(/\?.*$/, "");

  if (method.toUpperCase() === "DELETE" && route.endsWith("/messages/:id")) { // Delete Messsage endpoint has its own ratelimit
    return method + route;
  }
  return route;
}
