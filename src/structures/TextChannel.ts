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
    /** Post a message in a channel. Requires the `SEND_MESSAGES` permission.*/
    createMessage(content: string | CreateMessage) {
      return this._messages.createMessage(this.id, content);
    }

    /** Modify a message. Must be authored by you. */
    modifyMessage(messageID: string, content: string | ModifyMessage) {
      return this._messages.modifyMessage(this.id, messageID, content);
    }

    /** Delete a message in a channel. Requires the `MANAGE_MESSAGES` permission. */
    deleteMessage(messageID: string) {
      return this._messages.deleteMessage(this.id, messageID);
    }

    /** Show typing indicator while awaiting `func` Promise. */
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
