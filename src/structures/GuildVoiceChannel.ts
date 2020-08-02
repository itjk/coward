import { GuildChannel, GuildChannelClient } from "./GuildChannel.ts";

/**
 * Class representing a voice channel in a guild
 * @extends GuildChannel
 */
export class GuildVoiceChannel extends GuildChannel {
  public bitrate: number;
  public userLimit: number;

  constructor(data: any, client: GuildChannelClient) {
    super(data, client);

    this.bitrate = data.bitrate;
    this.userLimit = data.user_limit;
  }
}
