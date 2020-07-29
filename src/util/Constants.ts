export const Versions = { GATEWAY: 6, REST: 7, THIS: "v0.3.2" }
export const Discord = {
	API: "https://discord.com/api/v6",
	CDN: "https://cdn.discordapp.com",
	GATEWAY: "wss://gateway.discord.gg",
};

export const MessageFlags = new Map<string, number>([
	["CROSSPOSTED", 1 << 0],
	["IS_CROSSPOST", 1 << 1],
	["SUPPRESS_EMBEDS", 1 << 2],
	["SOURCE_MESSAGE_DELETED", 1 << 3],
	["URGENT", 1 << 4]
])

export const UserFlags = new Map<string, number>([
	["DISCORD_EMPLOYEE", 1 << 0],
	["DISCORD_PARTNER", 1 << 1],
	["HYPESQUAD_EVENTS", 1 << 2],
	["BUG_HUNTER_LEVEL_ONE", 1 << 3],
	["HOUSE_BRAVERY", 1 << 6],
	["HOUSE_BRILLIANCE", 1 << 7],
	["HOUSE_BALANCE", 1 << 8],
	["EARLY_SUPPORTER", 1 << 9],
	["TEAM_USER", 1 << 10],
	["SYSTEM", 1 << 12],
	["BUG_HUNTER_LEVEL_TWO", 1 << 14],
	["VERIFIED_BOT", 1 << 16],
	["VERIFIED_BOT_DEVELOPER", 1 << 17]
])

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
	["MANAGE_EMOJIS", 1 << 30]
]);

export const PremiumTypes = {
	NITRO_CLASSIC: 1,
	NITRO: 2
}

export const Intents = {
	GUILDS: 1<<0,
	GUILD_MEMBERS: 1<<1,
	GUILD_BANS: 1<<2,
	GUILD_EMOJIS: 1<<3,
	GUILD_INTEGRATIONS: 1<<4,
	GUILD_WEBHOOKS: 1<<5,
	GUILD_INVITES: 1<<6,
	GUILD_VOICE_STATES: 1<<7,
	GUILD_PRESENCES: 1<<8,
	GUILD_MESSAGES: 1<<9,
	GUILD_MESSAGE_REACTIONS: 1<<10,
	GUILD_MESSAGE_TYPING: 1<<11,
	DIRECT_MESSAGES: 1<<12,
	DIRECT_MESSAGE_REACTIONS: 1<<13,
	DIRECT_MESSAGE_TYPING: 1<<14
}

export const Endpoints = {
	CHANNELS: () => "/channels",
	CHANNEL: (channelID: string) => `/channels/${channelID}`,
	CHANNEL_MESSAGES: (channelID: string) => `/channels/${channelID}/messages`,
	CHANNEL_MESSAGE: (channelID: string, messageID: string) => `/channels/${channelID}/messages/${messageID}`,
	CHANNEL_MESSAGE_REACTIONS: (channelID: string, messageID: string) => `/channels/${channelID}/messages/${messageID}/reactions`,
	CHANNEL_MESSAGE_REACTION: (channelID: string, messageID: string, emoji: string) => `/channels/${channelID}/messages/${messageID}/reactions/${emoji}`,
	CHANNEL_MESSAGE_REACTION_USER: (channelID: string, messageID: string, emoji: string, userID: string) => `/channels/${channelID}/messages/${messageID}/reactions/${emoji}/${userID}`,
	CHANNEL_MESSAGE_BULK_DELETE: (channelID: string) => `/channels/${channelID}/messages/bulk-delete`,
	CHANNEL_PERMISSIONS: (channelID: string) => `/channels/${channelID}/permissions`,
	CHANNEL_PERMISSION: (channelID: string, overwriteID: string) => `/channels/${channelID}/permissions/${overwriteID}`,
	CHANNEL_INVITES: (channelID: string) => `/channels/${channelID}/invites`,
	CHANNEL_TYPING: (channelID: string) => `/channels/${channelID}/typing`,
	CHANNEL_PIN: (channelID: string, messageID: string) => `/channels/${channelID}/pins/${messageID}`,
	CHANNEL_PINS: (channelID: string) => `/channels/${channelID}/pins`,
	CHANNEL_RECIPIENTS: (channelID: string) => `/channels/${channelID}/recipients`,
	CHANNEL_RECIPIENT: (channelID: string, userID: string) => `/channels/${channelID}/recipients/${userID}`,
	CHANNEL_WEBHOOKS: (channelID: string) => `/channels/${channelID}/webhooks`,

	GUILDS: () => "/guilds",
	GUILD: (guildID: string) => `/guilds/${guildID}`,
	GUILD_PREVIEW: (guildID: string) => `/guilds/${guildID}/preview`,
	GUILD_AUDIT_LOG: (guildID: string) => `/guilds/${guildID}/audit-logs`,
	GUILD_EMOJIS: (guildID: string) => `/guilds/${guildID}/emojis`,
	GUILD_EMOJI: (guildID: string, emojiID: string) => `/guilds/${guildID}/emojis/${emojiID}`,
	GUILD_CHANNELS: (guildID: string) => `/guilds/${guildID}/channels`,
	GUILD_MEMBERS: (guildID: string) => `/guilds/${guildID}/members`,
	GUILD_MEMBER: (guildID: string, userID: string) => `/guilds/${guildID}/members/${userID}`,
	GUILD_MEMBER_NICK: (guildID: string, userID: string) => `/guilds/${guildID}/members/${userID}/nick`,
	GUILD_MEMBER_ROLES: (guildID: string, userID: string) => `/guilds/${guildID}/members/${userID}/roles`,
	GUILD_MEMBER_ROLE: (guildID: string, userID: string, roleID: string) => `/guilds/${guildID}/members/${userID}/roles/${roleID}`,
	GUILD_BANS: (guildID: string) => `/guilds/${guildID}/bans`,
	GUILD_BAN: (guildID: string, userID: string) => `/guilds/${guildID}/bans/${userID}`,
	GUILD_ROLES: (guildID: string) => `/guilds/${guildID}/roles`,
	GUILD_ROLE: (guildID: string, roleID: string) => `/guilds/${guildID}/roles/${roleID}`,
	GUILD_PRUNE: (guildID: string) => `/guilds/${guildID}/prune`,
	GUILD_REGIONS: (guildID: string) => `/guilds/${guildID}/regions`,
	GUILD_INVITES: (guildID: string) => `/guilds/${guildID}/invites`,
	GUILD_INTEGRATIONS: (guildID: string) => `/guilds/${guildID}/integrations`,
	GUILD_INTEGRATION: (guildID: string, integrationID: string) => `/guilds/${guildID}/integrations/${integrationID}`,
	GUILD_INTEGRATION_SYNC: (guildID: string, integrationID: string) => `/guilds/${guildID}/integrations/${integrationID}/sync`,
	GUILD_EMBED: (guildID: string) => `/guilds/${guildID}/embed`,
	GUILD_VANITY_URL: (guildID: string) => `/guilds/${guildID}/vanity-url`,
	GUILD_WIDGET: (guildID: string) => `/guilds/${guildID}/widget.png`,
	GUILD_WEBHOOKS: (guildID: string) => `/guilds/${guildID}/webhooks`,

	INVITE: (inviteCode: string) => `/invite/${inviteCode}`,

	USERS: () => "/users",
	USER: (userID: string) => `/users/${userID}`,
	USER_GUILDS: (userID: string) => `/users/${userID}/guilds`,
	USER_GUILD: (userID: string, guildID: string) => `/users/${userID}/guilds/${guildID}`,
	USER_CHANNELS: (userID: string) => `/users/${userID}/channels`,
	USER_CHANNEL: (userID: string, channelID: string) => `/users/${userID}/channels/${channelID}`,
	USER_CONNECTIONS: (userID: string) => `/users/${userID}/connections`,

	VOICE_REGIONS: () => "/voice/regions",

	WEBHOOK: (webhookID: string) => `/webhooks/${webhookID}`,
	WEBHOOKTOKEN: (webhookID: string, webhookToken: string) => `/webhooks/${webhookID}/${webhookToken}`,
	WEBHOOKTOKEN_SLACK: (webhookID: string, webhookToken: string) => `/webhooks/${webhookID}/${webhookToken}/slack`,
	WEBHOOKTOKEN_GITHUB: (webhookID: string, webhookToken: string) => `/webhooks/${webhookID}/${webhookToken}/github`,
};
