import { ModifyRole } from "./Options.ts";
import { Guild } from "./Guild.ts";
import { Permission } from "../util/Permission.ts";
import { Roles } from "./Handlers.ts";

/** Class representing a Role */
export class Role {
  public id: string;
  public name: string;
  public color: number;
  public hoist: boolean;
  public managed: boolean;
  public mentionable: boolean;
  public permissions: Permission;
  public position: number;

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
