import { Client } from "../Client.ts";
import { User } from "./User.ts"
import { GuildTextChannel } from "./GuildTextChannel.ts"
import { DMChannel } from "./DMChannel.ts"
import { GuildNewsChannel } from "./GuildNewsChannel.ts"
import  {MessageFlag } from "../util/MessageFlags.ts";

/** Class representing a message */
export class Message {
	public id: string;
	public content: string;
	public channel: GuildTextChannel | DMChannel | GuildNewsChannel;
	public author: User;
	public timestamp: string;
	public flags: MessageFlag;

	constructor(data: any, protected client: Client) {
		this.id = data.id;
		this.content = data.content;
		this.flags = new MessageFlag(data.flags);
		var channel: any;
		var guildID: any = client.channelGuildIDs.get(data.channel_id);
		var guild: any = client.guilds.get(guildID);
		if(guild != undefined) { channel = guild.channels.get(data.channel_id); }
		else { channel = client.dmChannels.get(data.channel_id); }
		this.channel = channel;
		this.author = new User(data.author);
		this.timestamp = data.timestamp;
	}
}
