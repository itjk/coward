import { Client } from "../Client.ts";
import { GuildChannel } from "./GuildChannel.ts";

/**
 * Class representing a store channel in a guild
 * @extends GuildChannel
 */
export class GuildStoreChannel extends GuildChannel {
  constructor(data: any, protected client: Client) {
    super(data, client);
  }
}
