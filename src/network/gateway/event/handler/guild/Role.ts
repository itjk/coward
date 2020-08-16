import type { Payload } from "../../../Payload.ts";
import type { Guild } from "../../../../../structures/Guild.ts";
import { Role } from "../../../../../structures/Role.ts";
import type { Emitter } from "../../../../../util/Emitter.ts";
import type { Roles } from "../../../../../structures/Handlers.ts";
import type { Guilds } from "../../../../../structures/Delegates.ts";

export interface RoleEventSubscriber {
  guildRoleCreate: Emitter<{ guild: Guild; role: Role }>;
  guildRoleUpdate: Emitter<{ guild: Guild; role: Role }>;
  guildRoleDelete: Emitter<{ guild: Guild; role: Role }>;
}

export function handleRoleEvent(
  message: Payload,
  { handler, subscriber, cache }: Readonly<{
    handler: Roles;
    subscriber: RoleEventSubscriber;
    cache: Guilds;
  }>,
) {
  switch (message.t) {
    case "GUILD_ROLE_CREATE": {
      const data = message.d as { guild_id: string; role: unknown };
      const guild = cache.getGuild(data.guild_id);

      if (guild == null) return;
      const role = new Role(data.role, guild, handler);

      subscriber.guildRoleCreate.emit({ guild, role });
      return;
    }
    case "GUILD_ROLE_UPDATE": {
      const data = message.d as { guild_id: string; role: unknown };
      const guild = cache.getGuild(data.guild_id);

      if (guild == null) return;
      const role = new Role(data.role, guild, handler);

      subscriber.guildRoleUpdate.emit({ guild, role });
      return;
    }
    case "GUILD_ROLE_DELETE": {
      const data = message.d as { guild_id: string; role_id: string };
      const guild = cache.getGuild(data.guild_id);

      if (guild == null) return;
      const role = guild.roles.get(data.role_id);

      if (role == null) return;

      subscriber.guildRoleDelete.emit({ guild, role });
      return;
    }
  }
}
