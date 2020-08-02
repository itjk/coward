import { User } from "./User.ts";
import { GuildTextChannel } from "./GuildTextChannel.ts";
import { DMChannel } from "./DMChannel.ts";
import { GuildNewsChannel } from "./GuildNewsChannel.ts";
import { MessageFlag } from "../util/MessageFlags.ts";
import { GuildMember } from "./GuildMember.ts";
import { Guilds, GuildChannelAssociation, DMChannels } from "./Delegates.ts";

export type MessageClient = Guilds & GuildChannelAssociation & DMChannels;

/** Class representing a message */
export class Message {
  public id: string;
  public content: string;
  public channel: GuildTextChannel | DMChannel | GuildNewsChannel;
  public author: User;
  public member?: GuildMember;
  public timestamp: string;
  public flags: MessageFlag;

  constructor(
    data: any,
    client: MessageClient,
  ) {
    this.id = data.id;
    this.content = data.content;
    this.flags = new MessageFlag(data.flags);
    this.author = new User(data.author);

    const guildID = client.getGuildId(data.channel_id)!;
    const guild = client.getGuild(guildID);

    this.channel = guild != undefined
      ? guild.channels.get(data.channel_id)
      : client.getDMChannel(data.channel_id);

    if (guild) this.member = guild.members.get(this.author.id);

    this.timestamp = data.timestamp;
  }
}
