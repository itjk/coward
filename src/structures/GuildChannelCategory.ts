import { GuildChannel, GuildChannelClient } from "./GuildChannel.ts";

/**
 * Class representing a channel category in a guild
 * @extends GuildChannel
 */
export class GuildChannelCategory extends GuildChannel {
  constructor(data: any, client: GuildChannelClient) {
    super(data, client);
  }
}
