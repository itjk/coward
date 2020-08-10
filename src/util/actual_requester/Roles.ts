import { Endpoints } from "../../util/Constants.ts";

import { Role } from "../../structures/Role.ts";
import type { Roles } from "../../structures/Handlers.ts";
import type {
  ModifyRole,
  CreateRole,
} from "../../structures/Options.ts";

import type { RequestHandler } from "../../network/rest/RequestHandler.ts";
import type { Database } from "../Database.ts";

export class RolesRequester implements Roles {
  constructor(
    private readonly requestHandler: RequestHandler,
    private readonly database: Database,
  ) {}

  /** Create a role in a guild. Requires `MANAGE_ROLES` permission. */
  async createRole(
    guildID: string,
    options: Readonly<CreateRole>,
  ): Promise<Role> {
    const data = await this.requestHandler.request(
      "POST",
      Endpoints.GUILD_ROLES(guildID),
      options,
    );
    const guild = this.database.getGuild(guildID);
    if (!guild) throw new Error("unknown guild");

    const role = new Role(data, guild, this);
    guild.roles.set(role.id, role);
    return role;
  }

  // TODO: modify role positions https://discord.com/developers/docs/resources/guild#modify-guild-role-positions

  /** Modify a role in a guild. Requires `MANAGE_ROLES` permission. */
  async modifyRole(
    guildID: string,
    roleID: string,
    options: Readonly<ModifyRole>,
  ): Promise<Role> {
    const data = await this.requestHandler.request(
      "PATCH",
      Endpoints.GUILD_ROLE(guildID, roleID),
      options,
    );
    const guild = this.database.getGuild(guildID);
    if (!guild) throw new Error("unknown guild");

    const role = new Role(data, guild, this);
    guild.roles.set(role.id, role);
    return role;
  }

  /** Delete a role in a guild. Requires `MANAGE_ROLES` permission. */
  async deleteRole(guildID: string, roleID: string): Promise<void> {
    await this.requestHandler.request(
      "DELETE",
      Endpoints.GUILD_ROLE(guildID, roleID),
    );
  }
}
