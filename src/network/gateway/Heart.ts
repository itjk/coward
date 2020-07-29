import { fear } from "../../util/fear.ts";
import { red } from "../../../deps.ts";
import { Payload, OpCode } from "./payload.ts";

export interface HeartDelegate {
  send(json: object): Promise<void>;
  attemptReconnect(): Promise<void>;
}

export class Heart {
  private heartbeatInterval = 0;
  private heartbeatTimer: number | null = null;
  private receivedAck = false;
  private _lastPingTimestamp = 0;
  private _ping = 0;
  private sequence: number | null = null;

  get lastPingTimestamp(): number {
    return this._lastPingTimestamp;
  }

  get ping(): number {
    return this._ping;
  }

  constructor(private delegate: HeartDelegate) {}

  async heartbeat(): Promise<void> {
    try {
      if (this.receivedAck) {
        await this.delegate.send({
          op: 1,
          d: this.sequence,
        });
      } else {
        console.log("Didn't receive heartbeat Ack!");
        await this.delegate.attemptReconnect();
      }
      this.receivedAck = false;
      this._lastPingTimestamp = Date.now();
    } catch (err) {
      fear(
        "error",
        "something went wrong when trying to heartbeat \n" +
          red(err.stack),
      );
    }
  }

  async handleWebSocketMessage(message: Payload): Promise<void> {
    if (message.s) {
      this.sequence = message.s;
    }
    if (message.op == OpCode.HELLO) {
      const data = message.d as { heartbeat_interval: number };
      this.heartbeatInterval = data.heartbeat_interval;
      this.heartbeatTimer = setInterval(
        () => this.heartbeat(),
        this.heartbeatInterval,
      );
    }
    if (message.op == OpCode.HEARTBEAT_ACK) {
      this.receivedAck = true;
      this._ping = Date.now() - this.lastPingTimestamp;
    }
  }

  close() {
    this.receivedAck = true;
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
  }
}
