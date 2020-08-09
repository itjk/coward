import { BitField } from "./BitField.ts";

export const Permissions = new Map<string, number>([
  ["CREATE_INSTANT_INVITE", 1 << 0],
  ["KICK_MEMBERS", 1 << 1],
  ["BAN_MEMBERS", 1 << 2],
  ["ADMINISTRATOR", 1 << 3],
  ["MANAGE_CHANNELS", 1 << 4],
  ["MANAGE_GUILD", 1 << 5],
  ["ADD_REACTIONS", 1 << 6],
  ["VIEW_AUDIT_LOG", 1 << 7],
  ["PRIORITY_SPEAKER", 1 << 8],
  ["STREAM", 1 << 9],
  ["VIEW_CHANNEL", 1 << 10],
  ["SEND_MESSAGES", 1 << 11],
  ["SEND_TTS_MESSAGES", 1 << 12],
  ["MANAGE_MESSAGES", 1 << 13],
  ["EMBED_LINKS", 1 << 14],
  ["ATTACH_FILES", 1 << 15],
  ["READ_MESSAGE_HISTORY", 1 << 16],
  ["MENTION_EVERYONE", 1 << 17],
  ["USE_EXTERNAL_EMOJIS", 1 << 18],
  ["VIEW_GUILD_INSIGHTS", 1 << 19],
  ["CONNECT", 1 << 20],
  ["SPEAK", 1 << 21],
  ["MUTE_MEMBERS", 1 << 22],
  ["DEAFEN_MEMBERS", 1 << 23],
  ["MOVE_MEMBERS", 1 << 24],
  ["USE_VAD", 1 << 25],
  ["CHANGE_NICKNAME", 1 << 26],
  ["MANAGE_NICKNAMES", 1 << 27],
  ["MANAGE_ROLES", 1 << 28],
  ["MANAGE_WEBHOOKS", 1 << 29],
  ["MANAGE_EMOJIS", 1 << 30],
]);

export type Perms =
  | "CREATE_INSTANT_INVITE"
  | "KICK_MEMBERS"
  | "BAN_MEMBERS"
  | "ADMINISTRATOR"
  | "MANAGE_CHANNELS"
  | "MANAGE_GUILD"
  | "ADD_REACTIONS"
  | "VIEW_AUDIT_LOG"
  | "PRIORITY_SPEAKER"
  | "STREAM"
  | "VIEW_CHANNEL"
  | "SEND_MESSAGES"
  | "SEND_TTS_MESSAGES"
  | "MANAGE_MESSAGES"
  | "EMBED_LINKS"
  | "ATTACH_FILES"
  | "READ_MESSAGE_HISTORY"
  | "MENTION_EVERYONE"
  | "USE_EXTERNAL_EMOJIS"
  | "VIEW_GUILD_INSIGHTS"
  | "CONNECT"
  | "SPEAK"
  | "MUTE_MEMBERS"
  | "DEAFEN_MEMBERS"
  | "MOVE_MEMBERS"
  | "USE_VAD"
  | "CHANGE_NICKNAME"
  | "MANAGE_NICKNAMES"
  | "MANAGE_ROLES"
  | "MANAGE_WEBHOOKS"
  | "MANAGE_EMOJIS";

export type PermissionResolvable =
  | number
  | BitField
  | PermissionResolvable[]
  | Perms;

export class Permission extends BitField {
  constructor(permission: PermissionResolvable) {
    super(permission, Permissions);
  }
  /**
	 * ```ts
	 * role.has("ADMINISTRATOR")
	 * ```
	*/
  has(permission: PermissionResolvable, checkAdmin: boolean = true) {
    return (checkAdmin && super.has("ADMINISTRATOR") || super.has(permission));
  }

  add(...bits: PermissionResolvable[]) {
    super.add(bits);
  }
}
