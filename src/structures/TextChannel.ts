import type { Channel } from "./Channel.ts";
import type { CreateMessage, ModifyMessage } from "./Options.ts";
import type { Messages } from "./Handlers.ts";

/**
 * @description Interface having messages for TextChannelMixIN
 * @export
 * @interface TextChannel
 * @extends {Channel}
 */
export interface TextChannel extends Channel {
  readonly _messages: Messages;
}

/**
 * Mix-in representing any text-based channel
 */
export function TextChannelMixIn<T extends new (...args: any[]) => TextChannel>(
  Base: T,
) {
  return class extends Base {
    createMessage(content: string | CreateMessage) {
      return this._messages.createMessage(this.id, content);
    }

    modifyMessage(messageID: string, content: string | ModifyMessage) {
      return this._messages.modifyMessage(this.id, messageID, content);
    }

    deleteMessage(messageID: string) {
      return this._messages.deleteMessage(this.id, messageID);
    }

    async withTyping(func: () => Promise<void>) {
      // `Trigger Typing Indicator` expires after 10 seconds
      const triggerTimer = setInterval(() => {
        this._messages.postTypingIndicator(this.id);
      }, 9000);

      try {
        return await func();
      } finally {
        clearInterval(triggerTimer);
      }
    }
  };
}
