import {
  WebSocket,
  connectWebSocket,
  isWebSocketCloseEvent,
  red,
} from "../../../deps.ts";
import { fear } from "../../util/Fear.ts";
import { Heart } from "./Heart.ts";
import { Client, Options } from "../../Client.ts";
import { handleEvent, EventSubscriber } from "./event/EventHandler.ts";
import { GuildDB, ChannelDB } from "./Event.ts";
import { Discord, Versions } from "../../util/Constants.ts";
import { OpCode, Payload } from "./Payload.ts";
import { newCloseEvent, CloseEventCode } from "./event/Close.ts";

export default class Gateway {
  private sock!: WebSocket;
  private _ping = 0;

  private sequence: number | null = null;
  private sessionID = "";
  private status = "connecting";

  private heart: Heart;

  get ping(): number {
    return this._ping;
  }

  constructor(
    private readonly options: {
      readonly token: string;
      readonly intents: Options.clientConstructor["intents"];
      readonly client: Client;
      readonly database: GuildDB & ChannelDB;
      readonly subscriber: EventSubscriber;
    },
  ) {
    this.heart = new Heart({
      send: (v: object) => this.sock.send(JSON.stringify(v)),
      attemptReconnect: () => this.attemptReconnect(),
    });
  }

  public async connect(): Promise<void> {
    try {
      this.sock = await connectWebSocket(
        `${Discord.GATEWAY}/v=${Versions.GATEWAY}`,
      );

      if (this.status === "resuming") {
        this.status = "handshaking";
        await this.sock.send(JSON.stringify({
          op: OpCode.RESUME,
          d: {
            token: this.options.token,
            session_id: this.sessionID,
            seq: this.sequence,
          },
        }));
      } else {
        this.status = "handshaking";
        await this.heart.heartbeat();
        await this.identify();
      }
      await this.mainCycle();
    } catch (err) {
      fear("error", "could not connect to websocket \n" + red(err.stack));
    }
  }

  private async mainCycle() {
    for await (const msg of this.sock) {
      if (isWebSocketCloseEvent(msg)) {
        fear("error", "websocket was closed");
        await this.onCloseEvent(msg);
        continue;
      }
      if (typeof msg === "string") {
        await this.handleWSMessage(JSON.parse(msg));
      }
    }
  }

  private async attemptReconnect() {
    this.status = "resuming";
    await this.close();
    await this.connect();
  }

  private async identify() {
    await this.sock.send(JSON.stringify({
      op: OpCode.IDENTIFY,
      d: {
        token: this.options.token,
        intents: this.options.intents,
        properties: {
          "$os": "linux",
          "$browser": "coward",
          "$device": "coward",
        },
      },
    }));
  }

  public async modifyPresence(
    settings: Options.modifyPresence,
  ) {
    await this.sock.send(JSON.stringify({
      op: OpCode.PRESENCE_UPDATE,
      d: {
        afk: false,
        game: settings.game,
        status: settings.status,
        since: (settings.status === "idle") ? Date.now() : 0,
      },
    }));
  }

  private async handleWSMessage(message: Payload & { t?: Event }) {
    if (message.s) {
      this.sequence = message.s;
    }
    await this.heart.handleWebSocketMessage(message);

    if (!message.t) return;
    handleEvent(
      this.options.client,
      message,
      this.options.subscriber,
      this.options.database,
    );
  }

  async close() {
    await this.heart.close();
    if (!this.sock.isClosed) await this.sock.close(1000);
  }

  private async onCloseEvent(
    message: { readonly code: CloseEventCode },
  ): Promise<void> {
    this.status = "disconnected";
    this.close();
    console.log(message.code);
    if (!message.code) return;

    const event = newCloseEvent(message.code, async () => {
      this.status = "reconnecting";
      await this.connect();
    });
    await event.handle();
  }
}
