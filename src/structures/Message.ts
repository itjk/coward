import { User } from "./User.ts";
import type { GuildTextChannel } from "./GuildTextChannel.ts";
import type { DMChannel } from "./DMChannel.ts";
import type { GuildNewsChannel } from "./GuildNewsChannel.ts";
import { MessageFlag } from "../util/MessageFlags.ts";
import type { GuildMember } from "./GuildMember.ts";
import type {
  Guilds,
  GuildChannelAssociation,
  DMChannels,
} from "./Delegates.ts";

export type MessageClient = Guilds & GuildChannelAssociation & DMChannels;

/** Class representing a message */
export class Message {
  public readonly id: string;
  public readonly content: string;
  public readonly channel: GuildTextChannel | DMChannel | GuildNewsChannel;
  public readonly author: User;
  public readonly member?: GuildMember;
  public readonly timestamp: string;
  public readonly flags: MessageFlag;

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
