import { Channel } from "./Channel.ts";
import { Options } from "../Client.ts";

/**
 * Mix-in representing any text-based channel
 */
export function TextChannelMixIn<T extends new (...args: any[]) => Channel>(
  Base: T,
) {
  return class extends Base {
    createMessage(content: string | Options.createMessage) {
      return this.__messages.createMessage(this.id, content);
    }

    modifyMessage(messageID: string, content: string | Options.modifyMessage) {
      return this.__messages.modifyMessage(this.id, messageID, content);
    }

    deleteMessage(messageID: string) {
      return this.__messages.deleteMessage(this.id, messageID);
    }
  };
}
