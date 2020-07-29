import { Client } from "../Client.ts"

import { GuildChannel } from "./GuildChannel.ts"
import { GuildTextChannel } from "./GuildTextChannel.ts"
import { GuildVoiceChannel } from "./GuildVoiceChannel.ts"
import { GuildChannelCategory } from "./GuildChannelCategory.ts"
import { GuildNewsChannel } from "./GuildNewsChannel.ts"
import { GuildStoreChannel } from "./GuildStoreChannel.ts"
import { GuildMember } from "./GuildMember.ts"
import { GuildEmoji } from "./GuildEmoji.ts"
import { Role } from "./Role.ts"

type GuildChannelTypes = GuildTextChannel | GuildVoiceChannel | GuildChannelCategory | GuildNewsChannel | GuildStoreChannel

/** Class representing a guild */
export class Guild {
	public id: string
	public name: string
	public ownerID: string
	public region: string

	/** A map of guild channels. */
	public channels: Map<string, GuildChannelTypes | any> = new Map<string, GuildChannelTypes | any>()
	/** A map of members */
	public members: Map<string, GuildMember> = new Map<string, GuildMember>()
	/** A map of emoji */
	public emojis: Map<string, GuildEmoji> = new Map<string, GuildEmoji>()
	/** A map of guild roles */
	public roles: Map<string, Role> = new Map<string, Role>()

	constructor(data: any, protected client: Client) {
		this.id = data.id
		this.name = data.name
		this.ownerID = data.ownerID
		this.region = data.region

		if(data.channels) {
			for (const chan of data.channels) {
				client.channelGuildIDs.set(chan.id, this.id)
				this.channels.set(chan.id, GuildChannel.from(chan, client))
			}
		}

		if(data.members) {
			for(const mem of data.members) {
				this.members.set(mem.user.id, new GuildMember(mem, this))
			}
		}

		if(data.emojis) {
			for(const e of data.emojis) {
				this.emojis.set(e.id, new GuildEmoji(e, this, client))
			}
		}

		if(data.roles) {
			for(const role of data.roles) {
				this.roles.set(role.id, new Role(role, this, client))
			}
		}
	}
}
