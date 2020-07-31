import { Client } from "../Client.ts";

import {
  GuildTextChannel,
  DMChannel,
  GuildVoiceChannel,
  GuildChannelCategory,
  GuildNewsChannel,
  GuildStoreChannel,
  PermissionOverwrite,
} from "../../mod.ts";
// This doesn't work unless I import them all from here.

/** Class representing a channel */
export class Channel {
  public id: string;
  public type: number;

  constructor(data: any, protected client: Client) {
    this.id = data.id;
    this.type = data.type;
  }

  static from(data: any, client: Client) {
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
