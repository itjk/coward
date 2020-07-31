import { Channel } from "../../../../structures/Channel.ts";
import { Emitter } from "../../../../util/Emitter.ts";
import { Payload } from "../../Payload.ts";
import { ChannelDB } from "../../Event.ts";
import { Client } from "../../../../Client.ts";
import { GuildTextChannel } from "../../../../structures/GuildTextChannel.ts";
import { DMChannel } from "../../../../structures/DMChannel.ts";
import { GuildVoiceChannel } from "../../../../structures/GuildVoiceChannel.ts";
import { GuildChannelCategory } from "../../../../structures/GuildChannelCategory.ts";
import { GuildNewsChannel } from "../../../../structures/GuildNewsChannel.ts";
import { GuildStoreChannel } from "../../../../structures/GuildStoreChannel.ts";

export interface RoleEventSubscriber {
  channelCreate: Emitter<{ channel: Channel }>;
  channelUpdate: Emitter<{ channel: Channel }>;
  channelDelete: Emitter<{ channel: Channel }>;
  channelPinsUpdate: Emitter<{ channel: Channel }>;
}

export function handleChannelEvent(
  message: Payload,
  subsscriber: RoleEventSubscriber,
  database: ChannelDB,
  client: Client,
) {
  const type = message.t;
  switch (type) {
    case "CHANNEL_CREATE": {
      const channel = channelFrom(message.d, client);
      if (channel instanceof DMChannel) {
        database.setDMChannel(channel.id, channel);
        database.setDMChannelUsersRelation(
          channel.recipients[0].id,
          channel.id,
        );
      }
      subsscriber.channelCreate.emit({ channel: channel });
      return;
    }
    case "CHANNEL_UPDATE": {
      const channel = channelFrom(message.d, client);
      if (channel instanceof DMChannel) {
        database.setDMChannel(channel.id, channel);
      }
      subsscriber.channelUpdate.emit({ channel: channel });
      return;
    }
    case "CHANNEL_DELETE": {
      const channel = channelFrom(message.d, client);
      if (channel instanceof DMChannel) {
        database.deleteDMChannel(channel.id);
        database.deleteDMChannelUsersRelations(channel.recipients[0].id);
      }
      subsscriber.channelDelete.emit({ channel: channel });
      return;
    }
    case "CHANNEL_PINS_UPDATE": {
      subsscriber.channelPinsUpdate.emit(
        { channel: channelFrom(message.d, client) },
      );
      return;
    }
  }
}

function channelFrom(data: any, client: Client): Channel {
  switch (data.type) {
    case 0:
      return new GuildTextChannel(data, client);
    case 1:
      return new DMChannel(data, client);
    case 2:
      return new GuildVoiceChannel(data, client);
    case 4:
      return new GuildChannelCategory(data, client);
    case 5:
      return new GuildNewsChannel(data, client);
    case 6:
      return new GuildStoreChannel(data, client);
    default:
      return new Channel(data, client);
  }
}
