import { BitField, BitFieldResolvable } from "./BitField.ts";
import { MessageFlags } from "./Constants.ts";

type MessageFlagType =
	"CROSSPOSTED" |
	"IS_CROSSPOST" |
	"SUPPRESS_EMBEDS" |
	"SOURCE_MESSAGE_DELETED" |
	"URGENT";
	

export type MessageFlagResolvable = MessageFlagType | number | BitField | MessageFlagResolvable[];

export class MessageFlag extends BitField {
	constructor(messageFlags: MessageFlagResolvable) {
		super(messageFlags)
		this.flags = MessageFlags
	}

	has(flag: MessageFlagResolvable) {
		return super.has(flag)
	}
}