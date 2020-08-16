import {
  GuildChannel,
  GuildChannelCache,
  GuildChannelHandler,
} from "./GuildChannel.ts";
import { TextChannelMixIn, TextChannel } from "./TextChannel.ts";
import type { Messages } from "./Handlers.ts";

/**
 * Class representing a news channel in a guild
 * @extends GuildChannel
 */
class GuildNewsChannel_ extends GuildChannel implements TextChannel {
  public readonly topic: string;
  public readonly lastMessageID: string; // TODO(fox-cat): contemplate message object here?

  readonly _messages: Messages;

  constructor(
    data: any,
    cache: GuildChannelCache,
    handler: GuildChannelHandler,
  ) {
    super(data, cache, handler);

    this._messages = handler;

    this.topic = data.topic || null;
    this.lastMessageID = data.last_message_id || null;
  }
}
export class GuildNewsChannel extends TextChannelMixIn(GuildNewsChannel_) {}
