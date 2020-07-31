import { Client } from "../Client.ts";
import { User } from "./User.ts";
import { GuildTextChannel } from "./GuildTextChannel.ts";
import { DMChannel } from "./DMChannel.ts";
import { GuildNewsChannel } from "./GuildNewsChannel.ts";
import { MessageFlag } from "../util/MessageFlags.ts";
import { GuildMember } from "./GuildMember.ts";

/** Class representing a message */
export class Message {
  public id: string;
  public content: string;
  public channel: GuildTextChannel | DMChannel | GuildNewsChannel;
  public author: User;
  public member?: GuildMember;
  public timestamp: string;
  public flags: MessageFlag;

  constructor(data: any, protected client: Client) {
    this.id = data.id;
    this.content = data.content;
    this.flags = new MessageFlag(data.flags);
    this.author = new User(data.author);

    let guildID = client.channelGuildIDs.get(data.channel_id)!;
    let guild = client.guilds.get(guildID);

    this.channel = guild != undefined
      ? guild.channels.get(data.channel_id)
      : client.dmChannels.get(data.channel_id);

    if (guild) this.member = guild.members.get(this.author.id);

    this.timestamp = data.timestamp;
  }
}
