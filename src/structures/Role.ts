import { Client, Options } from "../Client.ts";
import { Guild } from "./Guild.ts";
import { Permission } from "../util/Permission.ts";

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

  constructor(data: any, public guild: Guild, protected client: Client) {
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
    return this.client.deleteRole(this.guild.id, this.id);
  }

  modify(options: Options.modifyRole) {
    return this.client.modifyRole(this.guild.id, this.id, options);
  }
}
