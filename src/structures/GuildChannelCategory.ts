import { Client } from "../Client.ts";
import { GuildChannel } from "./GuildChannel.ts";

/**
 * Class representing a channel category in a guild
 * @extends GuildChannel
 */
export class GuildChannelCategory extends GuildChannel {
  constructor(data: any, protected client: Client) {
    super(data, client);
  }
}
