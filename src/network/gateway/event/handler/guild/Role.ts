import { Payload } from "../../../Payload.ts";
import { Guild } from "../../../../../structures/Guild.ts";
import { Role } from "../../../../../structures/Role.ts";
import { Emitter } from "../../../../../util/Emitter.ts";
import { Roles } from "../../../../../structures/Handlers.ts";
import { Guilds } from "../../../../../structures/Delegates.ts";

export interface RoleEventSubscriber {
  guildRoleCreate: Emitter<{ guild: Guild; role: Role }>;
  guildRoleUpdate: Emitter<{ guild: Guild; role: Role }>;
  guildRoleDelete: Emitter<{ guild: Guild; role: Role }>;
}

export function handleRoleEvent(
  message: Payload,
  { handler, subscriber, client }: {
    handler: Roles;
    subscriber: RoleEventSubscriber;
    client: Guilds;
  },
) {
  switch (message.t) {
    case "GUILD_ROLE_CREATE": {
      const data = message.d as { guild_id: string; role: unknown };
      const guild = client.getGuild(data.guild_id);

      if (guild == null) return;
      const role = new Role(data.role, guild, handler);

      guild.roles.set(role.id, role);
      client.setGuild(guild.id, guild);

      subscriber.guildRoleCreate.emit({ guild: guild, role: role });
      return;
    }
    case "GUILD_ROLE_UPDATE": {
      const data = message.d as { guild_id: string; role: unknown };
      const guild = client.getGuild(data.guild_id);

      if (guild == null) return;
      const role = new Role(data.role, guild, handler);

      guild.roles.set(role.id, role);
      client.setGuild(guild.id, guild);

      subscriber.guildRoleUpdate.emit(
        { guild: guild, role: new Role(data.role, guild, handler) },
      );
      return;
    }
    case "GUILD_ROLE_DELETE": {
      const data = message.d as { guild_id: string; role_id: string };
      const guild = client.getGuild(data.guild_id);

      if (guild == null) return;
      const role = guild.roles.get(data.role_id);

      if (role == null) return;
      guild.roles.delete(role.id);
      client.setGuild(guild.id, guild);

      subscriber.guildRoleDelete.emit({ guild: guild, role: role });
      return;
    }
  }
}
