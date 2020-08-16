import {
  GuildChannel,
  GuildChannelCache,
  GuildChannelHandler,
} from "./GuildChannel.ts";

/**
 * Class representing a voice channel in a guild
 * @extends GuildChannel
 */
export class GuildVoiceChannel extends GuildChannel {
  public readonly bitrate: number;
  public readonly userLimit: number;

  constructor(
    data: any,
    cache: GuildChannelCache,
    handler: GuildChannelHandler,
  ) {
    super(data, cache, handler);

    this.bitrate = data.bitrate;
    this.userLimit = data.user_limit;
  }
}
