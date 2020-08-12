import { Channel } from "./Channel.ts";
import { Guild, GuildClient, GuildHandler } from "./Guild.ts";
import { User } from "./User.ts";

export class Invite {
  public readonly code: string;
  public readonly guild?: Guild;
  public readonly channel: Channel;
  public readonly inviter?: User;

  constructor(data: any, client: GuildClient, handler: GuildHandler) {
    this.code = data.code;
    if (data.guild) this.guild = new Guild(data.guild, client, handler);
    if (data.inviter) this.inviter = new User(data.inviter);
    this.channel = Channel.from(data.channel, client, handler);
  }
}
