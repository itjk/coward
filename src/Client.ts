import { Endpoints, Intents } from "./util/Constants.ts";

import { Channel } from "./structures/Channel.ts";
import { Guild } from "./structures/Guild.ts";
import { GuildMember } from "./structures/GuildMember.ts";
import { DMChannel } from "./structures/DMChannel.ts";
import { Message } from "./structures/Message.ts";
import { User } from "./structures/User.ts";
import { Role } from "./structures/Role.ts";
import { Invite } from "./structures/Invite.ts";
import { EmbedMessage } from "./structures/EmbedMessage.ts";

import * as events from "./Events.ts";
import { RequestHandler } from "./network/rest/RequestHandler.ts";
import Gateway from "./network/gateway/WebsocketHandler.ts";

/**
 * Class representing the main client
 * @extends EventEmitter
 *
 *            import { Coward } from "https://deno.land/x/coward@v0.2.1/mod.ts"
 *            const client = new Coward("TOKEN_GOES_HERE")
 *
 *            client.events.ready.on(() => {
 *                console.log("READY")
 *            })
 *
 *            client.connect()
 */
export class Client {
  private requestHandler: RequestHandler;

  public gateway: Gateway;
  public guilds: Map<string, Guild> = new Map<string, Guild>();
  public users: Map<string, User> = new Map<string, User>();
  public dmChannels: Map<string, DMChannel> = new Map<string, DMChannel>();
  public dmChannelUsers: Map<string, string> = new Map<string, string>();
  public channelGuildIDs: Map<string, string> = new Map<string, string>();

  /** Create a Client */
  public constructor(
    public token: string,
    public options: Options.clientConstructor = {},
  ) {
    if (this.options.intents !== undefined) {
      let bitmask = 0;
      if (this.options.intents instanceof Array) {
        for (const intent of this.options.intents) {
          bitmask |= intent;
        }
      } else {
        bitmask = this.options.intents;
      }
      this.options.intents = bitmask;
    }

    this.gateway = new Gateway(
      {
        token,
        intents: this.options.intents,
        client: this,
        database: this,
        subscriber: this.events,
      },
    );
    this.requestHandler = new RequestHandler(token);
  }

  public events = events;

  private connectionTask!: Promise<void>;

  /** Connect to the Discord API */
  connect() {
    this.connectionTask = this.gateway.connect();
  }

  /** Disconnect to the Discord API */
  async disconnect() {
    await this.gateway.close();
    await this.connectionTask;
  }

  modifyPresence(
    options: Options.modifyPresence = { status: "online" },
  ): Promise<void> {
    return this.gateway.modifyPresence(options);
  }

  // database implementation starts
  // TODO: Split these implementation to another class
  getGuild(guildID: string): Guild | undefined {
    return this.guilds.get(guildID);
  }

  setGuild(guildID: string, guild: Guild) {
    this.guilds.set(guildID, guild);
  }

  setDMChannel(id: string, channel: DMChannel) {
    this.dmChannels.set(id, channel);
  }

  deleteDMChannel(id: string) {
    this.dmChannelUsers.delete(id);
  }

  setDMChannelUsersRelation(userId: string, channelId: string) {
    this.dmChannelUsers.set(userId, channelId);
  }

  deleteDMChannelUsersRelations(userId: string) {
    this.dmChannelUsers.delete(userId);
  }
  // database implementation ends

  /** Post a channel in a guild. Requires the `MANAGE_CHANNELS` permission. */
  createChannel(
    guildID: string,
    options: Options.createChannel,
  ): Promise<Channel> {
    return new Promise(async (resolve, reject) => {
      this.requestHandler.request(
        "POST",
        Endpoints.GUILD_CHANNELS(guildID),
        options,
      )
        .then((data: any) => {
          resolve(Channel.from(data, this));
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /** Modify a channel. Requires the `MANAGE_CHANNELS` permission in the guild. */
  modifyChannel(
    channelID: string,
    options: Options.modifyChannel,
  ): Promise<Channel> {
    return new Promise(async (resolve, reject) => {
      this.requestHandler.request(
        "PATCH",
        Endpoints.CHANNEL(channelID),
        options,
      )
        .then((data: any) => {
          resolve(Channel.from(data, this));
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /** Delete a channel. Requires the `MANAGE_CHANNELS` permission in the guild. */
  async deleteChannel(channelID: string): Promise<void> {
    await this.requestHandler.request("DELETE", Endpoints.CHANNEL(channelID));
  }

  /** Get a DM channel of a user - if there is none, create one. */
  getDMChannel(userID: string): Promise<DMChannel> {
    return new Promise(async (resolve, reject) => {
      let dmChannelID = this.dmChannelUsers.get(userID);
      if (dmChannelID !== undefined) {
        resolve(this.dmChannels.get(dmChannelID));
      } else {
        this.requestHandler.request(
          "POST",
          Endpoints.USER_CHANNELS("@me"),
          { recipients: [userID], type: 1 },
        )
          .then((data: any) => {
            resolve(new DMChannel(data, this));
          })
          .catch((err: any) => {
            reject(err);
          });
      }
    });
  }

  /** Post a message in a channel. Requires the `SEND_MESSAGES` permission.*/
  createMessage(
    channelID: string,
    content: string | Options.createMessage,
  ): Promise<Message> {
    if (typeof content === "string") content = { content: content };
    return new Promise(async (resolve, reject) => {
      this.requestHandler.request(
        "POST",
        Endpoints.CHANNEL_MESSAGES(channelID),
        content,
      )
        .then((data: any) => {
          resolve(new Message(data, this));
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /** Modify a message. Must be authored by you. */
  modifyMessage(
    /** Channel the message is in */
    channelID: string,
    /** Message to modify */
    messageID: string,
    content: string | Options.modifyMessage,
  ): Promise<Message> {
    if (typeof content === "string") content = { content: content };
    return new Promise(async (resolve, reject) => {
      this.requestHandler.request(
        "PATCH",
        Endpoints.CHANNEL_MESSAGE(channelID, messageID),
        content,
      )
        .then((data: any) => {
          resolve(new Message(data, this));
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /** Delete a message in a channel. Requires the `MANAGE_MESSAGES` permission. */
  async deleteMessage(
    /** Channel the message is in */
    channelID: string,
    /** The message to delete */
    messageID: string,
  ): Promise<void> {
    await this.requestHandler.request(
      "DELETE",
      Endpoints.CHANNEL_MESSAGE(channelID, messageID),
    );
  }

  // TODO: bulkDeleteMessage(channelID: string, amount: number): void {}

  /** Put a reaction on a message. Requires the `READ_MESSAGE_HISTORY` permission. Additionally, if nobody has reacted to the message with the emoji, requires the `ADD_REACTIONS` permission. */
  async putReaction(
    /** Channel the message is in */
    channelID: string,
    /** The message to put the reaction on */
    messageID: string,
    /** Emoji to react with. */
    emoji: string,
  ): Promise<void> {
    await this.requestHandler.request(
      "PUT",
      Endpoints.CHANNEL_MESSAGE_REACTION_USER(
        channelID,
        messageID,
        encodeURI(emoji),
        "@me",
      ),
    );
  }

  /** Delete a reaction on a message. If deleting a reaction from another user, requires the `MANAGE_MESSAGES` permission. */
  async deleteReaction(
    /** The channel the message is in */
    channelID: string,
    /** The message to delete the reaction from */
    messageID: string,
    /** The emoji to delete the reaction of */
    emoji: string,
    /** The user ID of the other user. Defaults to self. */
    userID?: string,
  ): Promise<void> {
    await this.requestHandler.request(
      "DELETE",
      Endpoints.CHANNEL_MESSAGE_REACTION_USER(
        channelID,
        messageID,
        encodeURI(emoji),
        userID || "@me",
      ),
    );
  }

  /** Delete all reactions from a message. Requires the `MANAGE_MESSAGES` permission. */
  async deleteAllReactions(
    /** The channel the message is in */
    channelID: string,
    /** The message to delete the reactions on */
    messageID: string,
  ): Promise<void> {
    await this.requestHandler.request(
      "DELETE",
      Endpoints.CHANNEL_MESSAGE_REACTIONS(channelID, messageID),
    );
  }

  /** Delete all reactions with a given emoji on a message. Requires `MANAGE_MESSAGES` permission. */
  async deleteAllEmojiReactions(
    /** The channel the message is in */
    channelID: string,
    /** The message to delete the reactions on */
    messageID: string,
    /** The emoji to delete the reactions of */
    emoji: string,
  ): Promise<void> {
    await this.requestHandler.request(
      "DELETE",
      Endpoints.CHANNEL_MESSAGE_REACTION(
        channelID,
        messageID,
        encodeURI(emoji),
      ),
    );
  }

  // TODO: putChannelPermissions ?

  createChannelInvite(
    channelID: string,
    inviteOptions?: { max_age?: number; max_uses?: number },
  ): Promise<Invite> {
    return this.requestHandler.request(
      "POST",
      Endpoints.CHANNEL_INVITES(channelID),
      inviteOptions,
    ) as Promise<Invite>;
  }

  /** Get invites in a guild channel. Returns an array of Invite objects. Requires `MANAGE_CHANNELS` permission. */
  getChannelInvites(channelID: string): Promise<Array<Invite>> {
    return new Promise(async (resolve, reject) => {
      this.requestHandler.request("GET", Endpoints.CHANNEL_INVITES(channelID))
        .then((data: any) => {
          const arrayInvites: Array<Invite> = [];
          data.forEach((invite: any) => {
            arrayInvites.push(new Invite(invite, this));
          });
          resolve(arrayInvites);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
	 * Post a typing indicator for a specified channel.
	 * Bots should usually not use this, however if a bot is responding to a command and expects the computation to take a few seconds, this may be used to let the user know that the bot is processing their message.
	 */
  async postTypingIndicator(channelID: string): Promise<void> {
    await this.requestHandler.request(
      "POST",
      Endpoints.CHANNEL_TYPING(channelID),
    );
  }

  /** Pin a message in a channel. Requires the `MANAGE_MESSAGES` permission. */
  async putPin(
    /** Channel to pin the message in */
    channelID: string,
    /** Message to pin */
    messageID: string,
  ): Promise<void> {
    await this.requestHandler.request(
      "PUT",
      Endpoints.CHANNEL_PIN(channelID, messageID),
    );
  }

  /** Delete a pinned channel message. Requires the `MANAGE_MESSAGES` permission. */
  async deletePin(
    /** Channel to delete the pin from */
    channelID: string,
    /** Message to delete the pin from */
    messageID: string,
  ): Promise<void> {
    await this.requestHandler.request(
      "DELETE",
      Endpoints.CHANNEL_PIN(channelID, messageID),
    );
  }

  // TODO: Emoji (https://discord.com/developers/docs/resources/emoji)

  /** Modify a guild. Requires the `MANAGE_GUILD` permission. */
  modifyGuild(guildID: string, options: Options.modifyGuild): Promise<Guild> {
    return new Promise(async (resolve, reject) => {
      this.requestHandler.request("PATCH", Endpoints.GUILD(guildID), options)
        .then((data: any) => {
          resolve(new Guild(data, this));
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /** Delete a guild permanently. Must be the owner. */
  async deleteGuild(guildID: string): Promise<void> {
    await this.requestHandler.request("DELETE", Endpoints.GUILD(guildID));
  }

  /** Modify the attributes of a guild member. */
  modifyMember(
    guildID: string,
    userID: string,
    options: Options.modifyMember,
  ): Promise<GuildMember> {
    return new Promise(async (resolve, reject) => {
      this.requestHandler.request(
        "PATCH",
        Endpoints.GUILD_MEMBER(guildID, userID),
        options,
      )
        .then((data: any) => {
          const guild = this.guilds.get(guildID);
          if (!guild) reject();
          else {
            const member = new GuildMember(data, guild);
            guild.members.set(member.user.id, member);
            resolve(member);
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /** Put a role on a member in a guild. Requires `MANAGE_ROLES` permission. */
  async putRole(
    /** Guild the member is in */
    guildID: string,
    /** Member to add the role to */
    userID: string,
    /** ID of the role */
    roleID: string,
  ): Promise<void> {
    await this.requestHandler.request(
      "PUT",
      Endpoints.GUILD_MEMBER_ROLE(guildID, userID, roleID),
    );
  }

  /** Remove a role from a member in a guild. Requires `MANAGE_ROLES` permission. */
  async removeRole(
    /** Guild the member is in */
    guildID: string,
    /** Member to remove the role from */
    userID: string,
    /** ID of the role */
    roleID: string,
  ): Promise<void> {
    await this.requestHandler.request(
      "DELETE",
      Endpoints.GUILD_MEMBER_ROLE(guildID, userID, roleID),
    );
  }

  /** Remove a member from a guild. Requires `KICK_MEMBERS` permission. */
  async removeMember(
    /** Guild the member is in */
    guildID: string,
    /** Member to remove from the guild */
    userID: string,
  ): Promise<void> {
    await this.requestHandler.request(
      "DELETE",
      Endpoints.GUILD_MEMBER(guildID, userID),
    );
  }

  /** Put a ban in a guild. Requires `BAN_MEMBERS` permission. */
  async putBan(
    /** Guild to put the ban in */
    guildID: string,
    /** User to ban */
    userID: string,
    options: Options.putBan,
  ): Promise<void> {
    await this.requestHandler.request(
      "PUT",
      Endpoints.GUILD_BAN(guildID, userID),
      options,
    );
  }

  /** Delete a ban from a guild. Requires `BAN_MEMBERS` permission. */
  async deleteBan(
    /** Guild to ban the user from */
    guildID: string,
    /** User to ban */
    userID: string,
  ): Promise<void> {
    await this.requestHandler.request(
      "DELETE",
      Endpoints.GUILD_BAN(guildID, userID),
    );
  }

  /** Create a role in a guild. Requires `MANAGE_ROLES` permission. */
  createRole(guildID: string, options: Options.createRole): Promise<Role> {
    return new Promise(async (resolve, reject) => {
      this.requestHandler.request(
        "POST",
        Endpoints.GUILD_ROLES(guildID),
        options,
      )
        .then((data: any) => {
          const guild = this.guilds.get(guildID);
          if (!guild) reject();
          else {
            const role = new Role(data, guild, this);
            guild.roles.set(role.id, role);
            resolve(role);
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  // TODO: modify role positions https://discord.com/developers/docs/resources/guild#modify-guild-role-positions

  /** Modify a role in a guild. Requires `MANAGE_ROLES` permission. */
  modifyRole(
    guildID: string,
    roleID: string,
    options: Options.modifyRole,
  ): Promise<Role> {
    return new Promise(async (resolve, reject) => {
      this.requestHandler.request(
        "PATCH",
        Endpoints.GUILD_ROLE(guildID, roleID),
        options,
      )
        .then((data: any) => {
          const guild = this.guilds.get(guildID);
          if (!guild) reject();
          else {
            const role = new Role(data, guild, this);
            guild.roles.set(role.id, role);
            resolve(role);
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /** Delete a role in a guild. Requires `MANAGE_ROLES` permission. */
  async deleteRole(guildID: string, roleID: string): Promise<void> {
    await this.requestHandler.request(
      "DELETE",
      Endpoints.GUILD_ROLE(guildID, roleID),
    );
  }

  // TODO: prune https://discord.com/developers/docs/resources/guild#modify-guild-role-positions
}

/** Namespace for functions */
export namespace Options {
  export interface clientConstructor {
    intents?: number[] | number;
  }

  export interface modifyPresence {
    status?: "online" | "dnd" | "idle" | "invisible" | "offline";
    game?: {
      name: string;
      type: number;
    };
  }

  export interface createChannel {
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

  export interface modifyChannel {
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

  export interface createMessage {
    content?: string;
    tts?: boolean;
    file?: { name: string; file: File | Blob };
    embed?: EmbedMessage;
  }

  export interface modifyMessage {
    content?: string;
    // TODO: file
    embed?: EmbedMessage;
  }

  export interface modifyGuild {
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

  export interface modifyMember {
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

  export interface putBan {
    /** Amount of days to delete messages for (between 1-7) */
    "delete-message-days"?: number;
    reason?: string;
  }

  export interface createRole {
    name?: string;
    //permissions?: number,
    color?: number;
    hoist?: boolean;
    mentionable?: boolean;
  }

  export interface modifyRole {
    name?: string;
    //permissions?: number,
    color?: number;
    hoist?: boolean;
    mentionable?: boolean;
  }
}
