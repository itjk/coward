import { GuildChannelClient } from "./GuildChannel.ts";
import { Messages } from "./Delegates.ts";
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
  public id: string;
  public type: number;

  constructor(data: any, public readonly __messages: Messages) {
    // TODO: Move `__messages` to TextChannelMixIn (but I don't know how to do).
    this.id = data.id;
    this.type = data.type;
  }

  static from(data: any, client: GuildChannelClient) {
    switch (data.type) {
      case 0:
        return new GuildTextChannel(data, client);
        break;
      case 1:
        return new DMChannel(data, client);
        break;
      case 2:
        return new GuildVoiceChannel(data, client);
        break;
      case 4:
        return new GuildChannelCategory(data, client);
        break;
      case 5:
        return new GuildNewsChannel(data, client);
        break;
      case 6:
        return new GuildStoreChannel(data, client);
        break;
      default:
        return new Channel(data, client);
        break;
    }
  }
}
