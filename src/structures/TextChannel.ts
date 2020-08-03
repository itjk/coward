import { Channel } from "./Channel.ts";
import { CreateMessage, ModifyMessage } from "./Options.ts";

/**
 * Mix-in representing any text-based channel
 */
export function TextChannelMixIn<T extends new (...args: any[]) => Channel>(
  Base: T,
) {
  return class extends Base {
    createMessage(content: string | CreateMessage) {
      return this.__messages.createMessage(this.id, content);
    }

    modifyMessage(messageID: string, content: string | ModifyMessage) {
      return this.__messages.modifyMessage(this.id, messageID, content);
    }

    deleteMessage(messageID: string) {
      return this.__messages.deleteMessage(this.id, messageID);
    }
  };
}
