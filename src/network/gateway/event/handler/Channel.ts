import { Channel } from "../../../../structures/Channel.ts";
import type { Emitter } from "../../../../util/Emitter.ts";
import type { Payload } from "../../Payload.ts";
import type {
  GuildCache,
  GuildHandler,
} from "../../../../structures/Guild.ts";

export interface RoleEventSubscriber {
  channelCreate: Emitter<{ channel: Channel }>;
  channelUpdate: Emitter<{ channel: Channel }>;
  channelDelete: Emitter<{ channel: Channel }>;
  channelPinsUpdate: Emitter<{ channel: Channel }>;
}

export function handleChannelEvent(
  message: Payload,
  { subscriber, cache, handler }: Readonly<{
    subscriber: RoleEventSubscriber;
    cache: GuildCache;
    handler: GuildHandler;
  }>,
) {
  const type = message.t;
  switch (type) {
    case "CHANNEL_CREATE":
      subscriber.channelCreate.emit(
        { channel: Channel.from(message.d, cache, handler) },
      );
      return;
    case "CHANNEL_UPDATE":
      subscriber.channelUpdate.emit(
        { channel: Channel.from(message.d, cache, handler) },
      );
      return;
    case "CHANNEL_DELETE":
      subscriber.channelDelete.emit(
        { channel: Channel.from(message.d, cache, handler) },
      );
      return;
    case "CHANNEL_PINS_UPDATE":
      subscriber.channelPinsUpdate.emit(
        { channel: Channel.from(message.d, cache, handler) },
      );
      return;
  }
}
