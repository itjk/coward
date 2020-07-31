import { User } from "./User.ts";
import { Guild } from "./Guild.ts";
import { Role } from "./Role.ts";
import { Permission } from "../util/Permission.ts";

/** Class representing a guild member */
export class GuildMember {
  public user: User;
  public nick!: string;
  public roles: Map<string, Role>; // TODO(fox-cat): role objects
  public joinedAt: string;
  public premiumSince!: string;
  public deaf: boolean;
  public mute: boolean;
  public permissions: Permission;

  constructor(data: any, public guild: Guild) {
    this.user = new User(data.user);
    this.nick = data.nick || null;

    this.permissions = new Permission(0);

    this.roles = new Map<string, Role>();
    for (let roleID of data.roles) {
      const role = guild.roles.get(roleID);

      if (!role) continue;

      this.roles.set(role.id, role);
      this.permissions.add(role.permissions);
    }

    this.joinedAt = data.joinedAt;
    this.premiumSince = data.premiumSince || null;
    this.deaf = data.deaf;
    this.mute = data.mute;
  }
}
