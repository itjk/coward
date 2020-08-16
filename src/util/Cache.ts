import type { GuildClient, Guild } from "../structures/Guild.ts";
import { DMChannel } from "../structures/DMChannel.ts";
import type { MessageClient } from "../structures/Message.ts";
import type {
  Events,
  EventsKey,
  EventsListener,
  EventsListeners,
} from "./Emitter.ts";

export class Cache implements GuildClient, MessageClient {
  private readonly guilds: Map<string, Guild> = new Map<string, Guild>();
  private readonly channelGuildIDs: Map<string, string> = new Map<
    string,
    string
  >();
  private readonly dmChannels: Map<string, DMChannel> = new Map<
    string,
    DMChannel
  >();
  private readonly dmChannelUsers: Map<string, string> = new Map<
    string,
    string
  >();

  private readonly subscribers: EventsListeners = {
    channelCreate: ({ channel }) => {
      if (channel instanceof DMChannel) {
        this.setDMChannel(channel.id, channel);
        this.setDMChannelUsersRelation(
          channel.recipients[0].id,
          channel.id,
        );
      }
    },
    channelUpdate: ({ channel }) => {
      if (channel instanceof DMChannel) {
        this.setDMChannel(channel.id, channel);
      }
    },
    channelDelete: ({ channel }) => {
      if (channel instanceof DMChannel) {
        this.deleteDMChannel(channel.id);
        this.deleteDMChannelUsersRelations(channel.recipients[0].id);
      }
    },
    guildCreate: ({ guild }) => {
      this.setGuild(guild.id, guild);
    },
    guildDelete: ({ guild }) => {
      this.deleteGuild(guild.id);
    },
    guildMemberAdd: ({ member, guild }) => {
      guild.members.set(member.user.id, member);
      this.setGuild(guild.id, guild);
    },
    guildMemberRemove: ({ member, guild }) => {
      guild.members.delete(member.user.id);
      this.setGuild(guild.id, guild);
    },
    guildRoleCreate: ({ guild, role }) => {
      guild.roles.set(role.id, role);
      this.setGuild(guild.id, guild);
    },
    guildRoleUpdate: ({ guild, role }) => {
      guild.roles.set(role.id, role);
      this.setGuild(guild.id, guild);
    },
    guildRoleDelete: ({ guild, role }) => {
      guild.roles.delete(role.id);
      this.setGuild(guild.id, guild);
    },
  };

  constructor(publishers: Events) {
    const entries = (Object.keys(publishers) as EventsKey[])
      .map((key) => [key, this.subscribers[key]])
      .filter((entry): entry is [EventsKey, EventsListener] =>
        entry[1] != null
      );

    for (const [key, subscriber] of entries) {
      const publisher = publishers[key];
      publisher.on(subscriber);
    }
  }

  getGuild(guildID: string): Guild | undefined {
    return this.guilds.get(guildID);
  }

  private setGuild(guildID: string, guild: Guild) {
    for (const chan of guild.channels.values()) {
      this.setGuildId(chan.id, guildID);
    }
    this.guilds.set(guildID, guild);
  }

  private deleteGuild(guildID: string) {
    this.guilds.delete(guildID);
  }

  getGuildId(channelID: string): string | undefined {
    return this.channelGuildIDs.get(channelID);
  }

  private setGuildId(channelID: string, guildID: string) {
    this.channelGuildIDs.set(channelID, guildID);
  }

  getDMChannel(id: string): DMChannel | undefined {
    return this.dmChannels.get(id);
  }

  private setDMChannel(id: string, channel: DMChannel) {
    this.dmChannels.set(id, channel);
  }

  private deleteDMChannel(id: string) {
    this.dmChannels.delete(id);
  }

  getDMChannelUsersRelation(userId: string): string | undefined {
    return this.dmChannelUsers.get(userId);
  }

  private setDMChannelUsersRelation(userId: string, channelId: string) {
    this.dmChannelUsers.set(userId, channelId);
  }

  private deleteDMChannelUsersRelations(userId: string) {
    this.dmChannelUsers.delete(userId);
  }
}
