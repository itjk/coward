import { User } from "./User.ts";
import type { Guild } from "./Guild.ts";
import type { Role } from "./Role.ts";
import { Permission } from "../util/Permission.ts";

/** Class representing a guild member */
export class GuildMember {
  public readonly user: User;
  public readonly nick!: string;
  public readonly roles: Map<string, Role>; // TODO(fox-cat): role objects
  public readonly joinedAt: string;
  public readonly premiumSince!: string;
  public readonly deaf: boolean;
  public readonly mute: boolean;
  public readonly permissions: Permission;

  constructor(data: any, public readonly guild: Guild) {
    this.user = new User(data.user);
    this.nick = data.nick || null;

    this.permissions = new Permission(0);

    this.roles = new Map<string, Role>();
    for (const roleID of data.roles) {
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
