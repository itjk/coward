import { BitField } from "./BitField.ts";

export const MessageFlags = new Map<string, number>([
  ["CROSSPOSTED", 1 << 0],
  ["IS_CROSSPOST", 1 << 1],
  ["SUPPRESS_EMBEDS", 1 << 2],
  ["SOURCE_MESSAGE_DELETED", 1 << 3],
  ["URGENT", 1 << 4],
]);

type MessageFlagType =
  | "CROSSPOSTED"
  | "IS_CROSSPOST"
  | "SUPPRESS_EMBEDS"
  | "SOURCE_MESSAGE_DELETED"
  | "URGENT";

export type MessageFlagResolvable =
  | MessageFlagType
  | number
  | BitField
  | MessageFlagResolvable[];

export class MessageFlag extends BitField {
  constructor(messageFlags: MessageFlagResolvable) {
    super(messageFlags, MessageFlags);
  }

  has(flag: MessageFlagResolvable) {
    return super.has(flag);
  }

  add(...bits: MessageFlagResolvable[]) {
    super.add(bits);
  }
}
