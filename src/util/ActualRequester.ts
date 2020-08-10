import { Endpoints } from "../util/Constants.ts";

import { Guild, GuildHandler } from "../structures/Guild.ts";
import { GuildMember } from "../structures/GuildMember.ts";
import { DMChannel } from "../structures/DMChannel.ts";
import { Invite } from "../structures/Invite.ts";
import { Database } from "../util/Database.ts";
import type { Requester } from "./Requester.ts";
import type {
  ModifyPresence,
  ModifyGuild,
  ModifyMember,
  PutBan,
} from "../structures/Options.ts";

import * as events from "../Events.ts";
import { RequestHandler } from "../network/rest/RequestHandler.ts";
import Gateway from "../network/gateway/WebsocketHandler.ts";

import { MessagesRequester } from "./actual_requester/Messages.ts";
import { ChannelsRequester } from "./actual_requester/Channels.ts";
import { RolesRequester } from "./actual_requester/Roles.ts";

/** ActualRequester requests with RequestHandler and Gateway. */
export class ActualRequester implements Requester {
  private readonly requestHandler: RequestHandler;
  private readonly database = new Database();
  private readonly gateway: Gateway;

  private readonly messages: MessagesRequester;
  private readonly channels: ChannelsRequester;
  private readonly roles: RolesRequester;

  constructor(
    { token, subscriber, intents }: {
      token: string;
      subscriber: typeof events;
      intents?: number;
    },
  ) {
    this.requestHandler = new RequestHandler(token);

    this.messages = new MessagesRequester(this.requestHandler, this.database);
    this.channels = new ChannelsRequester(
      this.requestHandler,
      this.database,
      this.messages,
    );
    this.roles = new RolesRequester(this.requestHandler, this.database);

    this.gateway = new Gateway(
      {
        token,
        intents,
        client: this.database,
        handler: {
          ...this.messages,
          ...this.channels,
          ...this.roles,
        } as GuildHandler,
        subscriber,
      },
    );
  }

  /** Connect to the Discord API */
  connect() {
    return this.gateway.connect();
  }

  /** Disconnect to the Discord API */
  disconnect() {
    return this.gateway.close();
  }

  modifyPresence(
    options: Readonly<ModifyPresence> = { status: "online" },
  ): Promise<void> {
    return this.gateway.modifyPresence(options);
  }

  // TODO: Below methods should split into `Permission`s
  // by identifying bot's permissions.

  /** Get a DM channel of a user - if there is none, create one. */
  async getDMChannel(userID: string): Promise<DMChannel> {
    const dmChannelID = this.database.getDMChannelUsersRelation(userID);
    if (dmChannelID != null) {
      const dmChannel = this.database.getDMChannel(dmChannelID);
      if (dmChannel != null) return dmChannel;
    }
    const data = await this.requestHandler.request(
      "POST",
      Endpoints.USER_CHANNELS("@me"),
      { recipients: [userID], type: 1 },
    );
    return new DMChannel(data, this.messages);
  }

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

  async createChannelInvite(
    channelID: string,
    inviteOptions?: Readonly<Partial<{ max_age: number; max_uses: number }>>,
  ): Promise<Invite> {
    const data = await this.requestHandler.request(
      "POST",
      Endpoints.CHANNEL_INVITES(channelID),
      inviteOptions,
    );
    return new Invite(
      data,
      this.database,
      { ...this.channels, ...this.messages, ...this.roles } as GuildHandler,
    );
  }

  /** Get invites in a guild channel. Returns an array of Invite objects. Requires `MANAGE_CHANNELS` permission. */
  async getChannelInvites(channelID: string): Promise<Array<Invite>> {
    const data = await this.requestHandler.request(
      "GET",
      Endpoints.CHANNEL_INVITES(channelID),
    );

    return Object.values(data as object).map((invite: any) =>
      new Invite(
        invite,
        this.database,
        { ...this.channels, ...this.messages, ...this.roles } as GuildHandler,
      )
    );
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
  async modifyGuild(
    guildID: string,
    options: Readonly<ModifyGuild>,
  ): Promise<Guild> {
    const data = await this.requestHandler.request(
      "PATCH",
      Endpoints.GUILD(guildID),
      options,
    );
    return new Guild(
      data,
      this.database,
      { ...this.channels, ...this.messages, ...this.roles } as GuildHandler,
    );
  }

  /** Delete a guild permanently. Must be the owner. */
  async deleteGuild(guildID: string): Promise<void> {
    await this.requestHandler.request("DELETE", Endpoints.GUILD(guildID));
  }

  /** Modify the attributes of a guild member. */
  async modifyMember(
    guildID: string,
    userID: string,
    options: Readonly<ModifyMember>,
  ): Promise<GuildMember> {
    const data = await this.requestHandler.request(
      "PATCH",
      Endpoints.GUILD_MEMBER(guildID, userID),
      options,
    );
    const guild = this.database.getGuild(guildID);
    if (!guild) throw new Error("unknown guild");

    const member = new GuildMember(data, guild);
    guild.members.set(member.user.id, member);
    return member;
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
    options: Readonly<PutBan>,
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

  // TODO: prune https://discord.com/developers/docs/resources/guild#modify-guild-role-positions
}
