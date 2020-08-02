import { Channel } from "./Channel.ts";
import { Guild, GuildClient } from "./Guild.ts";
import { User } from "./User.ts";

export class Invite {
  public code: string;
  public guild?: Guild;
  public channel: Channel;
  public inviter?: User;

  constructor(data: any, client: GuildClient) {
    this.code = data.code;
    if (data.guild) this.guild = new Guild(data.guild, client);
    if (data.inviter) this.inviter = new User(data.inviter);
    this.channel = new Channel(data.channel, client);
  }
}
