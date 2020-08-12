import type { Message } from "./Message.ts";
import {
  GuildChannel,
  GuildChannelClient,
  GuildChannelHandler,
} from "./GuildChannel.ts";
import { TextChannelMixIn, TextChannel } from "./TextChannel.ts";
import type { Messages } from "./Handlers.ts";

/**
 * Class representing a text channel in a guild
 * @extends GuildChannel
 */
class GuildTextChannel_ extends GuildChannel implements TextChannel {
  public readonly rateLimitPerUser: number;
  public readonly topic: string;

  public readonly messages: Map<string, Message> = new Map<string, Message>();
  // TODO: deal with messages. possible message limit from client options?
  // contemplate. ^_^

  readonly _messages: Messages;

  constructor(
    data: any,
    client: GuildChannelClient,
    handler: GuildChannelHandler,
  ) {
    super(data, client, handler);

    this._messages = handler;

    this.rateLimitPerUser = data.rate_limit_per_user;
    this.topic = data.topic || null;
  }
}

export class GuildTextChannel extends TextChannelMixIn(GuildTextChannel_) {}
