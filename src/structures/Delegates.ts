import type { Guild } from "./Guild.ts";
import type { DMChannel } from "./DMChannel.ts";

export interface Guilds {
  getGuild(id: string): Guild | undefined;
}

export interface GuildChannelAssociation {
  getGuildId(channelId: string): string | undefined;
}

export interface DMChannels {
  getDMChannel(id: string): DMChannel | undefined;
  getDMChannelUsersRelation(userId: string): string | undefined;
}
