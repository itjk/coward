import { Guild } from "./Guild.ts";
import { DMChannel } from "./DMChannel.ts";

export interface Guilds {
  getGuild(id: string): Guild | undefined;
  setGuild(guildID: string, guild: Guild): void;
  deleteGuild(guildID: string): void;
}

export interface GuildChannelAssociation {
  getGuildId(channelId: string): string | undefined;
  setGuildId(channelId: string, guildId: string): void;
}

export interface DMChannels {
  getDMChannel(id: string): DMChannel | undefined;
  setDMChannel(id: string, channel: DMChannel): void;
  setDMChannelUsersRelation(userId: string, channelId: string): void;
  deleteDMChannel(id: string): void;
  deleteDMChannelUsersRelations(userId: string): void;
}
