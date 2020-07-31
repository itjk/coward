import { BitField, BitFieldResolvable } from "./BitField.ts";
import { Permissions } from "./Constants.ts";

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
    super(permission);
    this.flags = Permissions;
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
