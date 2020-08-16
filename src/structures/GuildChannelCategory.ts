import {
  GuildChannel,
  GuildChannelCache,
  GuildChannelHandler,
} from "./GuildChannel.ts";

/**
 * Class representing a channel category in a guild
 * @extends GuildChannel
 */
export class GuildChannelCategory extends GuildChannel {
  constructor(
    data: any,
    cache: GuildChannelCache,
    handler: GuildChannelHandler,
  ) {
    super(data, cache, handler);
  }
}
