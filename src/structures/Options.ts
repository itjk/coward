import { EmbedMessage } from "./EmbedMessage.ts";

export interface ModifyPresence {
  status?: "online" | "dnd" | "idle" | "invisible" | "offline";
  game?: {
    name: string;
    type: number;
  };
}

export interface CreateChannel {
  name: string;
  type: number;
  position?: number;
  //permission_overwrites?:
  topic?: string;
  nsfw?: boolean;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  parent_id?: string;
}

export interface ModifyChannel {
  name?: string;
  type?: number;
  position?: number;
  topic?: string;
  nsfw?: boolean;
  rate_limit_per_user?: number;
  bitrate?: number;
  user_limit?: number;
  //permission_overwrites?: Array<>,
  parent_id?: string;
}

export interface CreateMessage {
  content?: string;
  tts?: boolean;
  file?: { name: string; file: File | Blob };
  embed?: EmbedMessage;
}

export interface ModifyMessage {
  content?: string;
  // TODO: file
  embed?: EmbedMessage;
}

export interface ModifyGuild {
  name?: string;
  region?: string;
  verification_level?: number;
  default_message_notifcations?: number;
  explicit_content_filter?: number;
  afk_channel_id?: string;
  afk_timeout?: number;
  // TODO: icon
  owner_id?: string;
  // TODO: splash
  // TODO: banner
  system_channel_id?: string;
  rules_channel_id?: string;
  public_updates_channel_id?: string;
  preferred_locale?: string;
}

export interface ModifyMember {
  /** Value to set the user's nickname to. Requires `MANAGE_NICKNAMES` permission */
  nick?: string;
  //roles?: Array<string>
  /** Whether the user is muted in voice channels. Requires `MUTE_MEMBERS` permission */
  mute?: boolean;
  /** Whether the user is deafened in voice channels. Requires `DEAFEN_MEMBERS` permission */
  deaf?: boolean;
  /** The channel to move the member to (if they are in a voice channel). Requires `MOVE_MEMBERS` permission */
  channel_id?: string;
}

export interface PutBan {
  /** Amount of days to delete messages for (between 1-7) */
  "delete-message-days"?: number;
  reason?: string;
}

export interface CreateRole {
  name?: string;
  //permissions?: number,
  color?: number;
  hoist?: boolean;
  mentionable?: boolean;
}

export interface ModifyRole {
  name?: string;
  //permissions?: number,
  color?: number;
  hoist?: boolean;
  mentionable?: boolean;
}
