import { Endpoints } from "../../util/Constants.ts";

import { Channel } from "../../structures/Channel.ts";
import { Channels } from "../../structures/Handlers.ts";
import {
  CreateChannel,
  ModifyChannel,
} from "../../structures/Options.ts";
import { RequestHandler } from "../../network/rest/RequestHandler.ts";
import { Database } from "../Database.ts";
import { MessagesRequester } from "./Messages.ts";

export class ChannelsRequester implements Channels {
  constructor(
    private readonly requestHandler: RequestHandler,
    private readonly database: Database,
    private readonly client: MessagesRequester,
  ) {}

  /** Post a channel in a guild. Requires the `MANAGE_CHANNELS` permission. */
  async createChannel(
    guildID: string,
    options: CreateChannel,
  ): Promise<Channel> {
    const data = await this.requestHandler.request(
      "POST",
      Endpoints.GUILD_CHANNELS(guildID),
      options,
    );
    return Channel.from(data, this.database, { ...this, ...this.client });
  }

  /** Modify a channel. Requires the `MANAGE_CHANNELS` permission in the guild. */
  async modifyChannel(
    channelID: string,
    options: ModifyChannel,
  ): Promise<Channel> {
    const data = await this.requestHandler.request(
      "PATCH",
      Endpoints.CHANNEL(channelID),
      options,
    );
    return Channel.from(data, this.database, { ...this, ...this.client });
  }

  /** Delete a channel. Requires the `MANAGE_CHANNELS` permission in the guild. */
  async deleteChannel(channelID: string): Promise<void> {
    await this.requestHandler.request("DELETE", Endpoints.CHANNEL(channelID));
  }

  // TODO: putChannelPermissions ?
}
