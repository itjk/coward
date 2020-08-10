import type { ModifyRole } from "./Options.ts";
import type { Guild } from "./Guild.ts";
import { Permission } from "../util/Permission.ts";
import type { Roles } from "./Handlers.ts";

/** Class representing a Role */
export class Role {
  public readonly id: string;
  public readonly name: string;
  public readonly color: number;
  public readonly hoist: boolean;
  public readonly managed: boolean;
  public readonly mentionable: boolean;
  public readonly permissions: Permission;
  public readonly position: number;

  constructor(data: any, public guild: Guild, private readonly handler: Roles) {
    this.permissions = new Permission(data.permissions);
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.hoist = data.hoist;
    this.managed = data.managed;
    this.mentionable = data.mentionable;
    this.position = data.position;
  }

  delete() {
    return this.handler.deleteRole(this.guild.id, this.id);
  }

  modify(options: ModifyRole) {
    return this.handler.modifyRole(this.guild.id, this.id, options);
  }
}
