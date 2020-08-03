import { Channel } from "../../../../structures/Channel.ts";
import { Emitter } from "../../../../util/Emitter.ts";
import { Payload } from "../../Payload.ts";
import { ChannelDB } from "../../Event.ts";
import { GuildTextChannel } from "../../../../structures/GuildTextChannel.ts";
import { DMChannel } from "../../../../structures/DMChannel.ts";
import { GuildVoiceChannel } from "../../../../structures/GuildVoiceChannel.ts";
import { GuildChannelCategory } from "../../../../structures/GuildChannelCategory.ts";
import { GuildNewsChannel } from "../../../../structures/GuildNewsChannel.ts";
import { GuildStoreChannel } from "../../../../structures/GuildStoreChannel.ts";
import { GuildClient, GuildHandler } from "../../../../structures/Guild.ts";

export interface RoleEventSubscriber {
  channelCreate: Emitter<{ channel: Channel }>;
  channelUpdate: Emitter<{ channel: Channel }>;
  channelDelete: Emitter<{ channel: Channel }>;
  channelPinsUpdate: Emitter<{ channel: Channel }>;
}

export function handleChannelEvent(
  message: Payload,
  { subscriber, database, client, handler }: {
    subscriber: RoleEventSubscriber;
    database: ChannelDB;
    client: GuildClient;
    handler: GuildHandler;
  },
) {
  const type = message.t;
  switch (type) {
    case "CHANNEL_CREATE": {
      const channel = channelFrom(message.d, client, handler);
      if (channel instanceof DMChannel) {
        database.setDMChannel(channel.id, channel);
        database.setDMChannelUsersRelation(
          channel.recipients[0].id,
          channel.id,
        );
      }
      subscriber.channelCreate.emit({ channel: channel });
      return;
    }
    case "CHANNEL_UPDATE": {
      const channel = channelFrom(message.d, client, handler);
      if (channel instanceof DMChannel) {
        database.setDMChannel(channel.id, channel);
      }
      subscriber.channelUpdate.emit({ channel: channel });
      return;
    }
    case "CHANNEL_DELETE": {
      const channel = channelFrom(message.d, client, handler);
      if (channel instanceof DMChannel) {
        database.deleteDMChannel(channel.id);
        database.deleteDMChannelUsersRelations(channel.recipients[0].id);
      }
      subscriber.channelDelete.emit({ channel: channel });
      return;
    }
    case "CHANNEL_PINS_UPDATE": {
      subscriber.channelPinsUpdate.emit(
        { channel: channelFrom(message.d, client, handler) },
      );
      return;
    }
  }
}

function channelFrom(
  data: any,
  client: GuildClient,
  handler: GuildHandler,
): Channel {
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
