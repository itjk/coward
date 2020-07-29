import { Payload } from "../../Payload.ts";
import { Message } from "../../../../structures/Message.ts";
import { Emitter } from "../../../../util/Emitter.ts";
import { Client } from "../../../../Client.ts";

export interface MessageEventSubscriber {
	messageCreate: Emitter<{ message: Message }>;
	messageUpdate: Emitter<{ message: Message }>;
	messageDelete: Emitter<
		{ messageID: string; channelID: string }
	>;
	messageDeleteBulk: Emitter<
		{ messageIDs: string[]; channelID: string }
	>;
}

export function handleMessageEvent(
	client: Client,
	message: Payload,
	subscriber: MessageEventSubscriber,
) {
	const type = message.t;
	switch (type) {
		case "MESSAGE_CREATE": {
			subscriber.messageCreate.emit(
				{ message: new Message(message.d, client) },
			);
			return;
		}
		case "MESSAGE_UPDATE": {
			if (!message.d || !(message.d as { author: unknown }).author) return;
			subscriber.messageUpdate.emit(
				{ message: new Message(message.d, client) },
			);
			return;
		}
		case "MESSAGE_DELETE": {
			const data = message.d as { id: string; channel_id: string };
			subscriber.messageDelete.emit(
				{ messageID: data.id, channelID: data.channel_id },
			);
			return;
		}
		case "MESSAGE_DELETE_BULK": {
			const data = message.d as { ids: string[]; channel_id: string };
			subscriber.messageDeleteBulk.emit(
				{ messageIDs: data.ids, channelID: data.channel_id },
			);
			return;
		}
			// TODO: MESSAGE_REACTION_ADD, MESSAGE_REACTION_REMOVE, MESSAGE_REACTION_REMOVE_ALL
	}
}
