import { Guild } from "../../structures/Guild.ts";
import { DMChannel } from "../../structures/DMChannel.ts";

const eventNames = [
	"HELLO",
	"READY",
	"RESUMED",
	"RECONNECT",
	"INVALID_SESSION",
	"CHANNEL_CREATE",
	"CHANNEL_UPDATE",
	"CHANNEL_DELETE",
	"CHANNEL_PINS_UPDATE",
	"GUILD_CREATE",
	"GUILD_UPDATE",
	"GUILD_DELETE",
	"GUILD_BAN_ADD",
	"GUILD_BAN_REMOVE",
	"GUILD_EMOJIS_UPDATE",
	"GUILD_INTEGRATIONS_UPDATE",
	"GUILD_MEMBER_ADD",
	"GUILD_MEMBER_REMOVE",
	"GUILD_MEMBER_UPDATE",
	"GUILD_MEMBERS_CHUNK",
	"GUILD_ROLE_CREATE",
	"GUILD_ROLE_UPDATE",
	"GUILD_ROLE_DELETE",
	"INVITE_CREATE",
	"INVITE_DELETE",
	"MESSAGE_CREATE",
	"MESSAGE_UPDATE",
	"MESSAGE_DELETE",
	"MESSAGE_DELETE_BULK",
	"MESSAGE_REACTION_ADD",
	"MESSAGE_REACTION_REMOVE",
	"MESSAGE_REACTION_REMOVE_ALL",
	"MESSAGE_REACTION_REMOVE_EMOJI",
	"PRESENCE_UPDATE",
	"TYPING_START",
	"USER_UPDATE",
	"VOICE_STATE_UPDATE",
	"VOICE_SERVER_UPDATE",
	"WEBHOOKS_UPDATE",
] as const;

export type Event = typeof eventNames[number];

export function EventSchema(input: unknown): Event {
	if (
		typeof input !== "string" ||
		(eventNames as unknown as string[]).includes(input)
	) {
		throw new TypeError(`Invalid event: ${input}`);
	}

	return input as unknown as Event;
}

export interface GuildDB {
	getGuild(guildID: string): Guild | undefined;
	setGuild(guildID: string, guild: Guild): void;
	deleteGuild(guildID: string): void;
}

export interface ChannelDB {
	setDMChannel(id: string, channel: DMChannel): void;
	setDMChannelUsersRelation(userId: string, channelId: string): void;
	deleteDMChannel(id: string): void;
	deleteDMChannelUsersRelations(userId: string): void;
}
