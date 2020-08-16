import type {
  GuildChannelCache,
  GuildChannelHandler,
} from "./GuildChannel.ts";
import {
  GuildTextChannel,
  DMChannel,
  GuildVoiceChannel,
  GuildChannelCategory,
  GuildNewsChannel,
  GuildStoreChannel,
} from "../../mod.ts";
// This doesn't work unless I import them all from here.

/** Class representing a channel */
export class Channel {
  public readonly id: string;
  public readonly type: number;

  constructor(data: any) {
    this.id = data.id;
    this.type = data.type;
  }

  static from(
    data: any,
    cache: GuildChannelCache,
    handler: GuildChannelHandler,
  ) {
    switch (data.type) {
      case 0:
        return new GuildTextChannel(data, cache, handler);
      case 1:
        return new DMChannel(data, handler);
      case 2:
        return new GuildVoiceChannel(data, cache, handler);
      case 4:
        return new GuildChannelCategory(data, cache, handler);
      case 5:
        return new GuildNewsChannel(data, cache, handler);
      case 6:
        return new GuildStoreChannel(data, cache, handler);
      default:
        return new Channel(data);
    }
  }
}
