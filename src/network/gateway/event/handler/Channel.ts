import { Channel } from "../../../../structures/Channel.ts";
import type { Emitter } from "../../../../util/Emitter.ts";
import type { Payload } from "../../Payload.ts";
import { DMChannel } from "../../../../structures/DMChannel.ts";
import type {
  GuildClient,
  GuildHandler,
} from "../../../../structures/Guild.ts";
import type { DMChannels } from "../../../../structures/Delegates.ts";

export interface RoleEventSubscriber {
  channelCreate: Emitter<{ channel: Channel }>;
  channelUpdate: Emitter<{ channel: Channel }>;
  channelDelete: Emitter<{ channel: Channel }>;
  channelPinsUpdate: Emitter<{ channel: Channel }>;
}

export function handleChannelEvent(
  message: Payload,
  { subscriber, client, handler }: Readonly<{
    subscriber: RoleEventSubscriber;
    client: GuildClient & DMChannels;
    handler: GuildHandler;
  }>,
) {
  const type = message.t;
  switch (type) {
    case "CHANNEL_CREATE": {
      const channel = Channel.from(message.d, client, handler);
      if (channel instanceof DMChannel) {
        client.setDMChannel(channel.id, channel);
        client.setDMChannelUsersRelation(
          channel.recipients[0].id,
          channel.id,
        );
      }
      subscriber.channelCreate.emit({ channel: channel });
      return;
    }
    case "CHANNEL_UPDATE": {
      const channel = Channel.from(message.d, client, handler);
      if (channel instanceof DMChannel) {
        client.setDMChannel(channel.id, channel);
      }
      subscriber.channelUpdate.emit({ channel: channel });
      return;
    }
    case "CHANNEL_DELETE": {
      const channel = Channel.from(message.d, client, handler);
      if (channel instanceof DMChannel) {
        client.deleteDMChannel(channel.id);
        client.deleteDMChannelUsersRelations(channel.recipients[0].id);
      }
      subscriber.channelDelete.emit({ channel: channel });
      return;
    }
    case "CHANNEL_PINS_UPDATE": {
      subscriber.channelPinsUpdate.emit(
        { channel: Channel.from(message.d, client, handler) },
      );
      return;
    }
  }
}
