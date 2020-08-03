import { Endpoints } from "../../util/Constants.ts";

import { Message } from "../../structures/Message.ts";
import { Messages } from "../../structures/Handlers.ts";
import { CreateMessage, ModifyMessage } from "../../structures/Options.ts";
import { RequestHandler } from "../../network/rest/RequestHandler.ts";
import { Database } from "../Database.ts";

export class MessagesRequester implements Messages {
  constructor(
    private readonly requestHandler: RequestHandler,
    private readonly database: Database,
  ) {}

  /** Post a message in a channel. Requires the `SEND_MESSAGES` permission.*/
  async createMessage(
    channelID: string,
    content: string | CreateMessage,
  ): Promise<Message> {
    if (typeof content === "string") content = { content: content };
    const data = await this.requestHandler.request(
      "POST",
      Endpoints.CHANNEL_MESSAGES(channelID),
      content,
    );
    return new Message(data, this.database);
  }

  /** Modify a message. Must be authored by you. */
  async modifyMessage(
    /** Channel the message is in */
    channelID: string,
    /** Message to modify */
    messageID: string,
    content: string | ModifyMessage,
  ): Promise<Message> {
    if (typeof content === "string") content = { content: content };
    const data = await this.requestHandler.request(
      "PATCH",
      Endpoints.CHANNEL_MESSAGE(channelID, messageID),
      content,
    );
    return new Message(data, this.database);
  }

  /** Delete a message in a channel. Requires the `MANAGE_MESSAGES` permission. */
  async deleteMessage(
    /** Channel the message is in */
    channelID: string,
    /** The message to delete */
    messageID: string,
  ): Promise<void> {
    await this.requestHandler.request(
      "DELETE",
      Endpoints.CHANNEL_MESSAGE(channelID, messageID),
    );
  }

  // TODO: bulkDeleteMessage(channelID: string, amount: number): void {}
}
