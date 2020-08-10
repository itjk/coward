import type { GuildClient, Guild } from "../structures/Guild.ts";
import type { DMChannel } from "../structures/DMChannel.ts";
import type { MessageClient } from "../structures/Message.ts";

export class Database implements GuildClient, MessageClient {
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

  getGuild(guildID: string): Guild | undefined {
    return this.guilds.get(guildID);
  }

  setGuild(guildID: string, guild: Guild) {
    this.guilds.set(guildID, guild);
  }

  deleteGuild(guildID: string) {
    this.guilds.delete(guildID);
  }

  getGuildId(channelID: string): string | undefined {
    return this.channelGuildIDs.get(channelID);
  }

  setGuildId(channelID: string, guildID: string) {
    this.channelGuildIDs.set(channelID, guildID);
  }

  getDMChannel(id: string): DMChannel | undefined {
    return this.dmChannels.get(id);
  }

  setDMChannel(id: string, channel: DMChannel) {
    this.dmChannels.set(id, channel);
  }

  deleteDMChannel(id: string) {
    this.dmChannels.delete(id);
  }

  getDMChannelUsersRelation(userId: string): string | undefined {
    return this.dmChannelUsers.get(userId);
  }

  setDMChannelUsersRelation(userId: string, channelId: string) {
    this.dmChannelUsers.set(userId, channelId);
  }

  deleteDMChannelUsersRelations(userId: string) {
    this.dmChannelUsers.delete(userId);
  }
}
