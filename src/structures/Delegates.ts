import { Options } from "../Client.ts";
import { Guild } from "./Guild.ts";
import { Role } from "./Role.ts";
import { Channel } from "./Channel.ts";
import { DMChannel } from "./DMChannel.ts";
import { Message } from "./Message.ts";

export interface Guilds {
  getGuild(id: string): Guild | undefined;
}

export interface GuildChannelAssociation {
  getGuildId(channelId: string): string | undefined;
  setGuildId(channelId: string, guildId: string): void;
}

export interface Channels {
  modifyChannel(id: string, options: Options.modifyChannel): Promise<Channel>;
  deleteChannel(id: string): Promise<void>;
}

export interface DMChannels {
  getDMChannel(id: string): DMChannel | undefined;
}

export interface Messages {
  createMessage(
    channelId: string,
    content: string | Options.createMessage,
  ): Promise<Message>;
  modifyMessage(
    channelId: string,
    messageId: string,
    options: string | Options.modifyMessage,
  ): Promise<Message>;
  deleteMessage(channelId: string, messageId: string): Promise<void>;
}

export interface Roles {
  modifyRole(
    guildId: string,
    roleId: string,
    options: Options.modifyRole,
  ): Promise<Role>;
  deleteRole(guildId: string, roleId: string): Promise<void>;
}
