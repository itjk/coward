import * as events from "./Events.ts";
import type { Requester } from "./util/Requester.ts";
import { ActualRequester } from "./util/ActualRequester.ts";

/**
 * Class representing the main client
 * @extends EventEmitter
 *
 *            import { Coward } from "https://deno.land/x/coward@v0.2.1/mod.ts"
 *            const client = new Coward("TOKEN_GOES_HERE")
 *
 *            client.events.ready.on(() => {
 *                console.log("READY")
 *            })
 *
 *            client.connect()
 */
export class Client {
  private readonly requester: Requester;
  private connectionTask: Promise<void> | null = null;

  public readonly events = events;

  /** Create a Client */
  public constructor(
    public token: string,
    public options: { intents?: number[] | number } = {},
  ) {
    if (this.options.intents !== undefined) {
      this.options.intents = (Array.isArray(this.options.intents))
        ? this.options.intents.reduce((prev, intent) => prev | intent, 0)
        : this.options.intents;
    }

    this.requester = new ActualRequester(
      { token, subscriber: this.events, intents: this.options.intents },
    );
  }

  /** Connect to the Discord API */
  connect() {
    this.connectionTask = this.requester.connect();
  }

  /** Disconnect to the Discord API */
  async disconnect() {
    await this.requester.disconnect();
    await this.connectionTask;
  }
}
