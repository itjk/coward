import { GuildChannel, GuildChannelClient } from "./GuildChannel.ts";

/**
 * Class representing a store channel in a guild
 * @extends GuildChannel
 */
export class GuildStoreChannel extends GuildChannel {
  constructor(data: any, client: GuildChannelClient) {
    super(data, client);
  }
}
