import { Channel } from "./Channel.ts";
import { Guild, GuildCache, GuildHandler } from "./Guild.ts";
import { User } from "./User.ts";

export class Invite {
  public readonly code: string;
  public readonly guild?: Guild;
  public readonly channel: Channel;
  public readonly inviter?: User;

  constructor(data: any, cache: GuildCache, handler: GuildHandler) {
    this.code = data.code;
    if (data.guild) this.guild = new Guild(data.guild, cache, handler);
    if (data.inviter) this.inviter = new User(data.inviter);
    this.channel = Channel.from(data.channel, cache, handler);
  }
}
