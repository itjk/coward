import { Payload } from "../../../Payload.ts";
import { Guild } from "../../../../../structures/Guild.ts";
import { Role } from "../../../../../structures/Role.ts";
import { Emitter } from "../../../../../util/Emitter.ts";
import { Client } from "../../../../../Client.ts";
import { GuildDB } from "../../../Event.ts";

export interface RoleEventSubscriber {
  guildRoleCreate: Emitter<{ guild: Guild; role: Role }>;
  guildRoleUpdate: Emitter<{ guild: Guild; role: Role }>;
  guildRoleDelete: Emitter<{ guild: Guild; role: Role }>;
}

export function handleRoleEvent(
  client: Client,
  message: Payload,
  subscriber: RoleEventSubscriber,
  database: GuildDB,
) {
  switch (message.t) {
    case "GUILD_ROLE_CREATE": {
      const data = message.d as { guild_id: string; role: unknown };
      const guild = database.getGuild(data.guild_id);

      if (guild == null) return;
      const role = new Role(data.role, guild, client);

      guild.roles.set(role.id, role);
      database.setGuild(guild.id, guild);

      subscriber.guildRoleCreate.emit({ guild: guild, role: role });
      return;
    }
    case "GUILD_ROLE_UPDATE": {
      const data = message.d as { guild_id: string; role: unknown };
      const guild = database.getGuild(data.guild_id);

      if (guild == null) return;
      const role = new Role(data.role, guild, client);

      guild.roles.set(role.id, role);
      database.setGuild(guild.id, guild);

      subscriber.guildRoleUpdate.emit(
        { guild: guild, role: new Role(data.role, guild, client) },
      );
      return;
    }
    case "GUILD_ROLE_DELETE": {
      const data = message.d as { guild_id: string; role_id: string };
      const guild = database.getGuild(data.guild_id);

      if (guild == null) return;
      const role = guild.roles.get(data.role_id);

      if (role == null) return;
      guild.roles.delete(role.id);
      database.setGuild(guild.id, guild);

      subscriber.guildRoleDelete.emit({ guild: guild, role: role });
      return;
    }
  }
}
