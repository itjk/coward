import type { Event } from "./Event.ts";

export enum OpCode {
  DISPATCH,
  HEARTBEAT,
  IDENTIFY,
  PRESENCE_UPDATE,
  VOICE_STATE_UPDATE,
  RESUME = 6,
  RECONNECT,
  REQUEST_GUILD_MEMBERS,
  INVALID_SESSION,
  HELLO,
  HEARTBEAT_ACK,
}

/** https://discord.com/developers/docs/topics/gateway#payloads-gateway-payload-structure */
export type Payload = {
  op: OpCode;
  d?: unknown;
  s?: number;
  t: Event;
};
