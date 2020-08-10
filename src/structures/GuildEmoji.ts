import { Role } from "./Role.ts";
import { User } from "./User.ts";
import type { Guild } from "./Guild.ts";
import type { Roles } from "./Handlers.ts";

/** Class representing an emoji in a guild */
export class GuildEmoji {
  public readonly id: string;
  public readonly name: string;
  public readonly roles: Map<string, Role> = new Map<string, Role>();
  /** User that created the emoji */
  public readonly user!: User;
  public readonly requireColons: boolean;
  /** Whether the emoji is managed */
  public readonly managed: boolean;
  public readonly animated: boolean;
  /** Whether the emoji is available - may be false due to loss of server boosts. */
  public readonly available: boolean;

  constructor(data: any, public readonly guild: Guild, client: Roles) {
    this.id = data.id;
    this.name = data.name;
    if (data.roles) {
      for (const r of data.roles) {
        this.roles.set(r.id, new Role(r, guild, client));
      }
    }
    if (this.user) this.user = new User(data.user) || null;
    this.requireColons = data.require_colons;
    this.managed = data.managed;
    this.animated = data.animated || false;
    this.available = data.available;
  }
}
