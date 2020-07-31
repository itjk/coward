import { Payload } from "../../../Payload.ts";
import { Guild } from "../../../../../structures/Guild.ts";
import { User } from "../../../../../structures/User.ts";
import { GuildMember } from "../../../../../structures/GuildMember.ts";
import { Emitter } from "../../../../../util/Emitter.ts";
import { GuildDB } from "../../../Event.ts";

export interface MemberEventSubscriber {
  guildMemberAdd: Emitter<{ guild: Guild; member: GuildMember }>;
  guildMemberUpdate: Emitter<
    { guild: Guild; member: GuildMember; oldMember: GuildMember }
  >;
  guildMemberRemove: Emitter<{ guild: Guild; member: GuildMember }>;
}

export function handleMemberEvent(
  message: Payload,
  subscriber: MemberEventSubscriber,
  database: GuildDB,
) {
  switch (message.t) {
    case "GUILD_MEMBER_ADD": {
      const data = message.d as { guild_id: string };
      const guild = database.getGuild(data.guild_id);
      if (guild == null) return;

      const member = new GuildMember(message.d, guild);
      if (!member.user) return;
      guild.members.set(member.user.id, member);
      database.setGuild(guild.id, guild);

      subscriber.guildMemberAdd.emit({ guild: guild, member: member });
      return;
    }
    case "GUILD_MEMBER_REMOVE": {
      const data = message.d as { guild_id: string; user: User };
      const guild = database.getGuild(data.guild_id);

      if (guild == null) return;

      const member = guild.members.get(data.user.id);
      if (!member || !member.user) return;

      guild.members.delete(member.user.id);
      database.setGuild(guild.id, guild);

      subscriber.guildMemberRemove.emit({ guild: guild, member: member });
      return;
    }
    case "GUILD_MEMBER_UPDATE": {
      const data = message.d as { guild_id: string; user: User };
      const guild = database.getGuild(data.guild_id);

      if (guild == null) return;
      const oldMember = guild.members.get(data.user.id);

      if (oldMember == null) return;
      const memberRaw = { ...oldMember, ...data };
      const member = new GuildMember(memberRaw, guild);

      subscriber.guildMemberUpdate.emit({ guild, member, oldMember });
      return;
    }
      // TODO: case "GUILD_MEMBER_CHUNK"
  }
}
