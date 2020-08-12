import type {
  ModifyChannel,
  CreateMessage,
  ModifyMessage,
  ModifyRole,
} from "./Options.ts";
import type { Channel } from "./Channel.ts";
import type { Message } from "./Message.ts";
import type { Role } from "./Role.ts";

export interface Channels {
  modifyChannel(id: string, options: ModifyChannel): Promise<Channel>;
  deleteChannel(id: string): Promise<void>;
}

export interface Messages {
  createMessage(
    channelId: string,
    content: string | CreateMessage,
  ): Promise<Message>;
  modifyMessage(
    channelId: string,
    messageId: string,
    options: string | ModifyMessage,
  ): Promise<Message>;
  deleteMessage(channelId: string, messageId: string): Promise<void>;
  postTypingIndicator(channelId: string): Promise<void>;
}

export interface Roles {
  modifyRole(
    guildId: string,
    roleId: string,
    options: ModifyRole,
  ): Promise<Role>;
  deleteRole(guildId: string, roleId: string): Promise<void>;
}
