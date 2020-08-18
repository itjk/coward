export const Versions = Object.freeze({ GATEWAY: 6, REST: 7, THIS: "v0.3.2" });
export const Discord = Object.freeze({
  API: "https://discord.com/api/v6",
  CDN: "https://cdn.discordapp.com",
  GATEWAY: "wss://gateway.discord.gg",
});

export const PremiumTypes = Object.freeze({
  NITRO_CLASSIC: 1,
  NITRO: 2,
});

export const Endpoints = Object.freeze({
  CHANNELS: () => "/channels",
  CHANNEL: (channelID: string) => `/channels/${channelID}`,
  CHANNEL_MESSAGES: (channelID: string) => `/channels/${channelID}/messages`,
  CHANNEL_MESSAGE: (channelID: string, messageID: string) =>
    `/channels/${channelID}/messages/${messageID}`,
  CHANNEL_MESSAGE_REACTIONS: (channelID: string, messageID: string) =>
    `/channels/${channelID}/messages/${messageID}/reactions`,
  CHANNEL_MESSAGE_REACTION: (
    channelID: string,
    messageID: string,
    emoji: string,
  ) => `/channels/${channelID}/messages/${messageID}/reactions/${emoji}`,
  CHANNEL_MESSAGE_REACTION_USER: (
    channelID: string,
    messageID: string,
    emoji: string,
    userID: string,
  ) =>
    `/channels/${channelID}/messages/${messageID}/reactions/${emoji}/${userID}`,
  CHANNEL_MESSAGE_BULK_DELETE: (channelID: string) =>
    `/channels/${channelID}/messages/bulk-delete`,
  CHANNEL_PERMISSIONS: (channelID: string) =>
    `/channels/${channelID}/permissions`,
  CHANNEL_PERMISSION: (channelID: string, overwriteID: string) =>
    `/channels/${channelID}/permissions/${overwriteID}`,
  CHANNEL_INVITES: (channelID: string) => `/channels/${channelID}/invites`,
  CHANNEL_TYPING: (channelID: string) => `/channels/${channelID}/typing`,
  CHANNEL_PIN: (channelID: string, messageID: string) =>
    `/channels/${channelID}/pins/${messageID}`,
  CHANNEL_PINS: (channelID: string) => `/channels/${channelID}/pins`,
  CHANNEL_RECIPIENTS: (channelID: string) =>
    `/channels/${channelID}/recipients`,
  CHANNEL_RECIPIENT: (channelID: string, userID: string) =>
    `/channels/${channelID}/recipients/${userID}`,
  CHANNEL_WEBHOOKS: (channelID: string) => `/channels/${channelID}/webhooks`,

  GUILDS: () => "/guilds",
  GUILD: (guildID: string) => `/guilds/${guildID}`,
  GUILD_PREVIEW: (guildID: string) => `/guilds/${guildID}/preview`,
  GUILD_AUDIT_LOG: (guildID: string) => `/guilds/${guildID}/audit-logs`,
  GUILD_EMOJIS: (guildID: string) => `/guilds/${guildID}/emojis`,
  GUILD_EMOJI: (guildID: string, emojiID: string) =>
    `/guilds/${guildID}/emojis/${emojiID}`,
  GUILD_CHANNELS: (guildID: string) => `/guilds/${guildID}/channels`,
  GUILD_MEMBERS: (guildID: string) => `/guilds/${guildID}/members`,
  GUILD_MEMBER: (guildID: string, userID: string) =>
    `/guilds/${guildID}/members/${userID}`,
  GUILD_MEMBER_NICK: (guildID: string, userID: string) =>
    `/guilds/${guildID}/members/${userID}/nick`,
  GUILD_MEMBER_ROLES: (guildID: string, userID: string) =>
    `/guilds/${guildID}/members/${userID}/roles`,
  GUILD_MEMBER_ROLE: (guildID: string, userID: string, roleID: string) =>
    `/guilds/${guildID}/members/${userID}/roles/${roleID}`,
  GUILD_BANS: (guildID: string) => `/guilds/${guildID}/bans`,
  GUILD_BAN: (guildID: string, userID: string) =>
    `/guilds/${guildID}/bans/${userID}`,
  GUILD_ROLES: (guildID: string) => `/guilds/${guildID}/roles`,
  GUILD_ROLE: (guildID: string, roleID: string) =>
    `/guilds/${guildID}/roles/${roleID}`,
  GUILD_PRUNE: (guildID: string) => `/guilds/${guildID}/prune`,
  GUILD_REGIONS: (guildID: string) => `/guilds/${guildID}/regions`,
  GUILD_INVITES: (guildID: string) => `/guilds/${guildID}/invites`,
  GUILD_INTEGRATIONS: (guildID: string) => `/guilds/${guildID}/integrations`,
  GUILD_INTEGRATION: (guildID: string, integrationID: string) =>
    `/guilds/${guildID}/integrations/${integrationID}`,
  GUILD_INTEGRATION_SYNC: (guildID: string, integrationID: string) =>
    `/guilds/${guildID}/integrations/${integrationID}/sync`,
  GUILD_EMBED: (guildID: string) => `/guilds/${guildID}/embed`,
  GUILD_VANITY_URL: (guildID: string) => `/guilds/${guildID}/vanity-url`,
  GUILD_WIDGET: (guildID: string) => `/guilds/${guildID}/widget.png`,
  GUILD_WEBHOOKS: (guildID: string) => `/guilds/${guildID}/webhooks`,

  INVITE: (inviteCode: string) => `/invite/${inviteCode}`,

  USERS: () => "/users",
  USER: (userID: string) => `/users/${userID}`,
  USER_GUILDS: (userID: string) => `/users/${userID}/guilds`,
  USER_GUILD: (userID: string, guildID: string) =>
    `/users/${userID}/guilds/${guildID}`,
  USER_CHANNELS: (userID: string) => `/users/${userID}/channels`,
  USER_CHANNEL: (userID: string, channelID: string) =>
    `/users/${userID}/channels/${channelID}`,
  USER_CONNECTIONS: (userID: string) => `/users/${userID}/connections`,

  VOICE_REGIONS: () => "/voice/regions",

  WEBHOOK: (webhookID: string) => `/webhooks/${webhookID}`,
  WEBHOOKTOKEN: (webhookID: string, webhookToken: string) =>
    `/webhooks/${webhookID}/${webhookToken}`,
  WEBHOOKTOKEN_SLACK: (webhookID: string, webhookToken: string) =>
    `/webhooks/${webhookID}/${webhookToken}/slack`,
  WEBHOOKTOKEN_GITHUB: (webhookID: string, webhookToken: string) =>
    `/webhooks/${webhookID}/${webhookToken}/github`,
});
