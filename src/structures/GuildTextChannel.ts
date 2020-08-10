import type { Message } from "./Message.ts";
import {
  GuildChannel,
  GuildChannelClient,
  GuildChannelHandler,
} from "./GuildChannel.ts";
import { TextChannelMixIn } from "./TextChannel.ts";

/**
 * Class representing a text channel in a guild
 * @extends GuildChannel
 */
export class GuildTextChannel extends TextChannelMixIn(GuildChannel) {
  public readonly rateLimitPerUser: number;
  public readonly topic: string;

  public readonly messages: Map<string, Message> = new Map<string, Message>();
  // TODO: deal with messages. possible message limit from client options?
  // contemplate. ^_^

  constructor(
    data: any,
    client: GuildChannelClient,
    handler: GuildChannelHandler,
  ) {
    super(data, client, handler);

    this.rateLimitPerUser = data.rate_limit_per_user;
    this.topic = data.topic || null;
  }
}
