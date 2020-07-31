import { fear } from "../../../util/Fear.ts";

export enum CloseEventCode {
  UNKNOWN_ERROR = 4000,
  UNKNOWN_OPCODE,
  DECODE_ERROR,
  NOT_AUTHENTICATED,
  AUTHENTICATION_FAILED,
  ALREADY_AUTHENTICATED,
  INVALID_SEQ = 4007,
  RATE_LIMITED,
  SESSION_TIMED_OUT,
  INVALID_SHARD,
  SHARDING_REQUIRED,
  INVALID_API_VERSION,
  INVALID_INTENTS,
  DISALLOWED_INTENTS,
}

export interface CloseEvent {
  handle(): Promise<void>;
}

export function newCloseEvent(
  code: CloseEventCode,
  reconnectHandler: () => Promise<void>,
): CloseEvent {
  switch (code) {
    case CloseEventCode.UNKNOWN_ERROR:
    case CloseEventCode.INVALID_SEQ:
    case CloseEventCode.RATE_LIMITED:
    case CloseEventCode.SESSION_TIMED_OUT:
      return new ReconnectEvent(reconnectHandler);
  }
  return new FearEvent(code);
}

class ReconnectEvent implements CloseEvent {
  constructor(private reconnectHandler: () => Promise<void>) {}

  handle(): Promise<void> {
    return this.reconnectHandler();
  }
}

const fearMessages = {
  [CloseEventCode.UNKNOWN_ERROR]: "",
  [CloseEventCode.UNKNOWN_OPCODE]:
    "Unknown Opcode: You sent an invalid Gateway opcode or an invalid payload for an opcode. Don't do that!",
  [CloseEventCode.DECODE_ERROR]:
    "Decode Error: You sent an invalid payload to us. Don't do that!",
  [CloseEventCode.NOT_AUTHENTICATED]:
    "Not Authenticated: You sent us a payload prior to identifying.",
  [CloseEventCode.AUTHENTICATION_FAILED]:
    "Authentication Failed: The account token sent with your identify payload is incorrect.",
  [CloseEventCode.ALREADY_AUTHENTICATED]:
    "Already Authenticated: You sent more than one identify payload. Don't do that!",
  [CloseEventCode.INVALID_SEQ]: "",
  [CloseEventCode.RATE_LIMITED]: "",
  [CloseEventCode.SESSION_TIMED_OUT]: "",
  [CloseEventCode.INVALID_SHARD]:
    "Invalid Shard: You sent us an invalid shard when identifying.",
  [CloseEventCode.SHARDING_REQUIRED]:
    "Sharding Required: The session would have handled too many guilds - you are required to shard your connection in order to connect.",
  [CloseEventCode.INVALID_API_VERSION]:
    "Invalid API Version: You sent an invalid version for the gateway.",
  [CloseEventCode.INVALID_INTENTS]:
    "Invalid Intent(s): You sent an invalid intent for a Gateway Intent. You may have incorrectly calculated the bitwise value.",
  [CloseEventCode.DISALLOWED_INTENTS]:
    "Disallowed Intent(s): You sent a disallowed intent for a Gateway Intent. You may have tried to specify an intent that you have not enabled or are not whitelisted for.",
};

class FearEvent implements CloseEvent {
  constructor(private readonly code: CloseEventCode) {}

  async handle() {
    fear("error", fearMessages[this.code]);
  }
}
