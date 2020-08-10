import { Emitter } from "./util/Emitter.ts";

import type { Channel } from "./structures/Channel.ts";
import type { Guild } from "./structures/Guild.ts";
import type { GuildMember } from "./structures/GuildMember.ts";
import type { GuildEmoji } from "./structures/GuildEmoji.ts";
import type { ReactionCustomEmoji } from "./structures/ReactionCustomEmoji.ts";
import type { ReactionStandardEmoji } from "./structures/ReactionStandardEmoji.ts";
import type { Message } from "./structures/Message.ts";
import type { User } from "./structures/User.ts";
import type { Role } from "./structures/Role.ts";

/** Fired when the client is ready. */
export const ready = new Emitter();

/** Fired when a channel is created. */
export const channelCreate: Emitter<{ channel: Channel }> = new Emitter<
  { channel: Channel }
>();

/** Fired when a channel is updated. */
export const channelUpdate: Emitter<{ channel: Channel }> = new Emitter<
  { channel: Channel }
>();

/** Fired when a channel is deleted. */
export const channelDelete: Emitter<{ channel: Channel }> = new Emitter<
  { channel: Channel }
>();

/** Fired when a message is pinned or unpinned in a text channel. This is not fired when a pinned message is deleted. */
export const channelPinsUpdate: Emitter<{ channel: Channel }> = new Emitter<
  { channel: Channel }
>();

/**
 * Fired when
 *	- The client is initally connecting.
 *	- A guild becomes available to the client.
 *	- The client joins a guild.
 */
export const guildCreate: Emitter<{ guild: Guild }> = new Emitter<
  { guild: Guild }
>();

/**
 * Fired when
 *	- The client leaves or is removed from a guild.
 *	- A guild becomes unavailable.
 */
export const guildDelete: Emitter<{ guild: Guild }> = new Emitter<
  { guild: Guild }
>();

/** Fired when a user is banned from a guild. */
export const guildBanAdd: Emitter<{ guild: Guild; user: User }> = new Emitter<
  { guild: Guild; user: User }
>();

/** Fired when a user is unbanned from a guild. */
export const guildBanRemove: Emitter<{ guild: Guild; user: User }> =
  new Emitter<{ guild: Guild; user: User }>();

/** Fired when a guild's emojis have been updated. */
export const guildEmojisUpdate: Emitter<
  { guild: Guild; emojis: Array<GuildEmoji> }
> = new Emitter<{ guild: Guild; emojis: Array<GuildEmoji> }>();

/** Fired when a guild's integrations are updated. */
export const guildIntegrationsUpdate: Emitter<{ guild: Guild }> = new Emitter<
  { guild: Guild }
>();

/** Fired when a new user joins a guild. */
export const guildMemberAdd: Emitter<{ guild: Guild; member: GuildMember }> =
  new Emitter<{ guild: Guild; member: GuildMember }>();

/** Fired when a user leaves or is removed from a guild. */
export const guildMemberRemove: Emitter<{ guild: Guild; member: GuildMember }> =
  new Emitter<{ guild: Guild; member: GuildMember }>();

/** Fired when a guild member is updated. */
//TODO: Is there a better way of doing this? :v
export const guildMemberUpdate: Emitter<
  { guild: Guild; member: GuildMember; oldMember: GuildMember }
> = new Emitter<
  { guild: Guild; member: GuildMember; oldMember: GuildMember }
>();

//TODO: EmitterGuildMemberChunk: https://discord.com/developers/docs/topics/gateway#guild-members-chunk

/** Fired when a guild role is created. */
export const guildRoleCreate: Emitter<{ guild: Guild; role: Role }> =
  new Emitter<{ guild: Guild; role: Role }>();

/** Fired when a guild role is updated. */
export const guildRoleUpdate: Emitter<{ guild: Guild; role: Role }> =
  new Emitter<{ guild: Guild; role: Role }>();

/** Fired when a guild role is deleted. */
export const guildRoleDelete: Emitter<{ guild: Guild; role: Role }> =
  new Emitter<{ guild: Guild; role: Role }>();

// TODO: Invites (see https://discord.com/developers/docs/topics/gateway#invites)

/** Fired when a message is created. */
export const messageCreate: Emitter<{ message: Message }> = new Emitter<
  { message: Message }
>();

/** Fired when a message is updated. */
export const messageUpdate: Emitter<{ message: Message }> = new Emitter<
  { message: Message }
>();

/** Fired when a message is deleted. */
export const messageDelete: Emitter<{ messageID: string; channelID: string }> =
  new Emitter<{ messageID: string; channelID: string }>();

/** Fired when messages are deleted in bulk. */
export const messageDeleteBulk: Emitter<
  { messageIDs: Array<string>; channelID: string }
> = new Emitter<{ messageIDs: Array<string>; channelID: string }>();

/** TODO: Fired when a reaction is added to a message. */
export const messageReactionAdd: Emitter<
  {
    user: User;
    channel: Channel;
    emoji: ReactionStandardEmoji | ReactionCustomEmoji;
    messageID: string;
  }
> = new Emitter<
  {
    user: User;
    channel: Channel;
    emoji: ReactionStandardEmoji | ReactionCustomEmoji;
    messageID: string;
  }
>();

/** TODO: Fired when a reaction is removed from a message. */
export const messageReactionRemove: Emitter<
  {
    user: User;
    channel: Channel;
    emoji: ReactionStandardEmoji | ReactionCustomEmoji;
    messageID: string;
  }
> = new Emitter<
  {
    user: User;
    channel: Channel;
    emoji: ReactionStandardEmoji | ReactionCustomEmoji;
    messageID: string;
  }
>();

/** TODO: Fired when a user removes all reactions from a message. */
export const messageReactionRemoveAll: Emitter<
  { channel: Channel; messageID: string }
> = new Emitter<{ channel: Channel; messageID: string }>();

// TODO: Presence ...https://discord.com/developers/docs/topics/gateway#presence-update

/** Fired when a user starts typing in a channel. */
export const typingStart: Emitter<
  { channel: Channel; userID: string; timestamp: number }
> = new Emitter<{ channel: Channel; userID: string; timestamp: number }>();

// TODO: Voice ...https://discord.com/developers/docs/topics/gateway#voice
