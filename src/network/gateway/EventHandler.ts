import { Client } from "../../Client.ts"
import { Guild } from "../../structures/Guild.ts"
import { GuildMember } from "../../structures/GuildMember.ts"
import { GuildEmoji } from "../../structures/GuildEmoji.ts"
import { DMChannel } from "../../structures/DMChannel.ts"
import { Message } from "../../structures/Message.ts"
import { User } from "../../structures/User.ts"
import { Role } from "../../structures/Role.ts"
import { Channel } from "../../structures/Channel.ts"

export function handleEvent(client: Client, message: any) {
	switch(message.t) {
		case "READY": {
			client.events.ready.emit(undefined)
			break
		}
		case "CHANNEL_CREATE": {
			const channel = Channel.from(message.d, client)
			if(channel instanceof DMChannel) {
				client.dmChannels.set(channel.id, channel)
				client.dmChannelUsers.set(channel.recipients[0].id, channel.id)
			}
			client.events.channelCreate.emit({channel: channel})
			break
		}
		case "CHANNEL_UPDATE": {
			const channel = Channel.from(message.d, client)
			if(channel instanceof DMChannel) {
				client.dmChannels.set(channel.id, channel)
			}
			client.events.channelUpdate.emit({channel: channel})
			break
		}
		case "CHANNEL_DELETE": {
			const channel = Channel.from(message.d, client)
			if(channel instanceof DMChannel) {
				client.dmChannels.delete(channel.id)
				client.dmChannelUsers.delete(channel.recipients[0].id)
			}
			client.events.channelDelete.emit({channel: channel})
			break
		}
		case "CHANNEL_PINS_UPDATE": {
			client.events.channelPinsUpdate.emit({channel: Channel.from(message.d, client)})
			break
		}
		case "GUILD_CREATE": {
			const guild = new Guild(message.d, client)
			client.guilds.set(guild.id, guild)
			client.events.guildCreate.emit({guild: guild})
			break
		}
		case "GUILD_DELETE": {
			const guild = new Guild(message.d, client)
			client.guilds.delete(guild.id)
			client.events.guildDelete.emit({guild: guild})
			break
		}
		case "GUILD_BAN_ADD": {
			const guild = client.guilds.get(message.d.guild_id)
			if(guild !== undefined) client.events.guildBanAdd.emit({guild: guild, user: new User(message.d.user, client)})
			break
		}
		case "GUILD_BAN_REMOVE": {
			const guild = client.guilds.get(message.d.guild_id)
			if(guild !== undefined) client.events.guildBanRemove.emit({guild: guild, user: new User(message.d.user, client)})
			break
		}
		case "GUILD_EMOJIS_UPDATE": {
			const guild = client.guilds.get(message.d.guild_id)
			let emojis = new Array<GuildEmoji>()
			if (guild == undefined) break

			for(const emoji of message.d.emojis) emojis.push(new GuildEmoji(emoji, guild, client))
			client.events.guildEmojisUpdate.emit({guild: guild, emojis: emojis})
			break
		}
		case "GUILD_INTEGRATIONS_UPDATE": {
			const guild = client.guilds.get(message.d.guild_id)
			if(guild !== undefined) client.events.guildIntegrationsUpdate.emit({guild: guild})
			break
		}
		case "GUILD_MEMBER_ADD": {
			let guild = client.guilds.get(message.d.guild_id)
			if(guild == undefined) break

			const member = new GuildMember(message.d, guild, client)
			guild.members.set(member.user.id, member)
			client.guilds.set(guild.id, guild)

			client.events.guildMemberAdd.emit({guild: guild, member: member})
			break
		}
		case "GUILD_MEMBER_REMOVE": {
			let guild = client.guilds.get(message.d.guild_id)

			if(guild == undefined) break

			let member = guild.members.get(message.d.user.id)
			if(member == undefined) break

			guild.members.delete(member.user.id)
			client.guilds.set(guild.id, guild)

			client.events.guildMemberRemove.emit({guild: guild, member: member})
			break
		}
		case "GUILD_MEMBER_UPDATE": {
			let guild = client.guilds.get(message.d.guild_id)

			if(guild == undefined) break
			let oldMember = guild.members.get(message.d.user.id)

			if(oldMember == undefined) break
			let member = oldMember
			member.user = message.d.user
			member.roles = message.d.roles
			member.nick = message.d.nick || null
			member.premiumSince = message.d.premium_since || null

			client.events.guildMemberUpdate.emit({guild: guild, member: member, oldMember: oldMember})
			break
		}
		// TODO: case "GUILD_MEMBER_CHUNK"
		case "GUILD_ROLE_CREATE": {
			let guild = client.guilds.get(message.d.guild_id)

			if(guild == undefined) break
			let role = new Role(message.d.role, guild, client)

			guild.roles.set(role.id, role)
			client.guilds.set(guild.id, guild)

			client.events.guildRoleCreate.emit({guild: guild, role: role})
			break
		}
		case "GUILD_ROLE_UPDATE": {
		 	let guild = client.guilds.get(message.d.guild_id)

			if(guild == undefined) break
			let role = new Role(message.d.role, guild, client)

			guild.roles.set(role.id, role)
			client.guilds.set(guild.id, guild)

			client.events.guildRoleUpdate.emit({guild: guild, role: new Role(message.d.role, guild, client)})
			break
		}
		case "GUILD_ROLE_DELETE":  {
			let guild = client.guilds.get(message.d.guild_id)

			if(guild == undefined) break
			let role = guild.roles.get(message.d.role_id)

			if(role == undefined) break
			guild.roles.delete(role.id)
			client.guilds.set(guild.id, guild)

			client.events.guildRoleDelete.emit({guild: guild, role: role})
			break
		}
		// TODO: invites
		case "MESSAGE_CREATE": {
			client.events.messageCreate.emit({message: new Message(message.d, client)})
			break
		}
		case "MESSAGE_UPDATE": {
			if(!message.d.author) break
			client.events.messageUpdate.emit({message: new Message(message.d, client)})
			break
		}
		case "MESSAGE_DELETE": {
			client.events.messageDelete.emit({messageID: message.d.id, channelID: message.d.channel_id})
			break
		}
		case "MESSAGE_DELETE_BULK": {
			client.events.messageDeleteBulk.emit({messageIDs: message.d.ids, channelID: message.d.channel_id})
			break
		}
		// TODO: MESSAGE_REACTION_ADD, MESSAGE_REACTION_REMOVE, MESSAGE_REACTION_REMOVE_ALL
		// TODO: TYPING_START
	}
}