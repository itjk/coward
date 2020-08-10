import type {
  GuildChannelClient,
  GuildChannelHandler,
} from "./GuildChannel.ts";
import type { Messages } from "./Handlers.ts";
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

  constructor(data: any, protected readonly __messages: Messages) {
    // TODO: Move `__messages` to TextChannelMixIn (but I don't know how to do).
    this.id = data.id;
    this.type = data.type;
  }

  static from(
    data: any,
    client: GuildChannelClient,
    handler: GuildChannelHandler,
  ) {
    switch (data.type) {
      case 0:
        return new GuildTextChannel(data, client, handler);
      case 1:
        return new DMChannel(data, handler);
      case 2:
        return new GuildVoiceChannel(data, client, handler);
      case 4:
        return new GuildChannelCategory(data, client, handler);
      case 5:
        return new GuildNewsChannel(data, client, handler);
      case 6:
        return new GuildStoreChannel(data, client, handler);
      default:
        return new Channel(data, handler);
    }
  }
}
