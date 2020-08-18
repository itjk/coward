import type { EventsKey, Events } from "../Events.ts";
import { BitField } from "../util/BitField.ts";

/** 
 * A bit field expressing conditionally subscription on Discord API.
 * https://discord.com/developers/docs/topics/gateway#gateway-intents
 */
export const intents = {
  GUILDS: 1 << 0,
  GUILD_MEMBERS: 1 << 1,
  GUILD_BANS: 1 << 2,
  GUILD_EMOJIS: 1 << 3,
  GUILD_INTEGRATIONS: 1 << 4,
  GUILD_WEBHOOKS: 1 << 5,
  GUILD_INVITES: 1 << 6,
  GUILD_VOICE_STATES: 1 << 7,
  GUILD_PRESENCES: 1 << 8,
  GUILD_MESSAGES: 1 << 9,
  GUILD_MESSAGE_REACTIONS: 1 << 10,
  GUILD_MESSAGE_TYPING: 1 << 11,
  DIRECT_MESSAGES: 1 << 12,
  DIRECT_MESSAGE_REACTIONS: 1 << 13,
  DIRECT_MESSAGE_TYPING: 1 << 14,
} as const;

export type IntentsKey = keyof typeof intents;

// These commented out keys are not implemented now.
/** Store `EventsKey`s by the keys of `Intents`. */
export const EventKeysByIntents: Readonly<
  Record<IntentsKey, Readonly<EventsKey[]>>
> = {
  GUILDS: [
    "guildCreate",
    "guildUpdate",
    "guildDelete",
    "guildRoleCreate",
    "guildRoleUpdate",
    "guildRoleDelete",
    "channelCreate",
    "channelUpdate",
    "channelDelete",
    "channelPinsUpdate",
  ],
  GUILD_MEMBERS: [
    "guildMemberAdd",
    "guildMemberUpdate",
    "guildMemberRemove",
  ],
  GUILD_BANS: [
    "guildBanAdd",
    "guildBanRemove",
  ],
  GUILD_EMOJIS: [
    "guildEmojisUpdate",
  ],
  GUILD_INTEGRATIONS: [
    "guildIntegrationsUpdate",
  ],
  GUILD_WEBHOOKS: [
    // "webhooksUpdate",
  ],
  GUILD_INVITES: [
    // "inviteCreate",
    // "inviteDelete",
  ],
  GUILD_VOICE_STATES: [
    // "voiceStateUpdate",
  ],
  GUILD_PRESENCES: [
    // "presenceUpdate",
  ],
  GUILD_MESSAGES: [
    "messageCreate",
    "messageUpdate",
    "messageDelete",
    "messageDeleteBulk",
  ],
  GUILD_MESSAGE_REACTIONS: [
    "messageReactionAdd",
    "messageReactionRemove",
    "messageReactionRemoveAll",
    // "messageReactionRemoveEmoji",
  ],
  GUILD_MESSAGE_TYPING: [
    "typingStart",
  ],
  DIRECT_MESSAGES: [
    "channelCreate",
    "messageCreate",
    "messageUpdate",
    "messageDelete",
    "channelPinsUpdate",
  ],
  DIRECT_MESSAGE_REACTIONS: [
    "messageReactionAdd",
    "messageReactionRemove",
    "messageReactionRemoveAll",
    // "messageReactionRemoveEmoji",
  ],
  DIRECT_MESSAGE_TYPING: [
    "typingStart",
  ],
};

export type IntentsResolvable =
  | IntentsKey
  | number
  | BitField
  | IntentsResolvable[];

export class Intents extends BitField {
  constructor(resolvables: IntentsResolvable) {
    super(resolvables, new Map(Object.entries(intents)));
  }
}

export type EventKeyByIntentsKey<K extends IntentsKey> =
  typeof EventKeysByIntents[K][number];

export type EventsByIntents<K extends IntentsKey> = Pick<
  Events,
  EventKeyByIntentsKey<K>
>;

function eventsByIntent<K extends IntentsKey>(
  events: Events,
  key: K,
): EventsByIntents<K> {
  const eventKeys = EventKeysByIntents[key];
  return eventKeys.reduce((acc, key) => ({
    ...acc,
    [key]: events[key],
  }), {} as EventsByIntents<K>);
}

/** Extract events from `events` by `keys` of Intents */
export function eventsByIntents<K extends IntentsKey>(
  events: Events,
  ...keys: K[]
): EventsByIntents<K> {
  return keys.reduce((acc, key) => ({
    ...acc,
    ...eventsByIntent(events, key),
  }), {} as EventsByIntents<K>);
}
