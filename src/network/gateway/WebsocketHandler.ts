import {
	connectWebSocket,
	isWebSocketCloseEvent,
	WebSocket,

	red
} from "../../../deps.ts";
import { Versions, Discord } from "../../util/Constants.ts";
import { fear } from "../../util/Fear.ts";

import { Client } from "../../Client.ts";
import { handleEvent } from "./EventHandler.ts";

export default class Gateway {
	public sock!: WebSocket;
	public lastPingTimestamp: number = 0;
	public ping: number = 0;

	private sequence: any = null
	private sessionID: string = ""
	private heartbeatInt: number = 0
	private receivedAck: boolean = true
	private status: string = "connecting"

	constructor(private token: string, private client: Client) {}

	public async connect(): Promise<void> {
		try {
			this.sock = await connectWebSocket(`${Discord.GATEWAY}/v=${Versions.GATEWAY}`);

			if(this.status === "resuming") {
				this.status = "handshaking"
				await this.sock.send(JSON.stringify({
					op: 6,
					d: {
						token: this.token,
						session_id: this.sessionID,
						seq: this.sequence
					}
				}))
			} else {
				this.status = "handshaking"
				await this.singleHeartbeat()
				await this.identify()
			}

			for await (const msg of this.sock) {
				if (isWebSocketCloseEvent(msg)) {
					fear("error", "websocket was closed");
					this.onClose(msg);
				} else if (typeof msg === "string") {
					this.handleWSMessage(JSON.parse(msg));
				}
			}
		} catch (err) {
			fear("error", "could not connect to websocket \n" + red(err.stack))
		}
	}

	private async attemptReconnect() {
		this.status = "resuming"
		await this.close()
		await this.connect()
	}

	private singleHeartbeat() {
		if(this.receivedAck) {
			this.sock.send(JSON.stringify({
				op: 1,
				d: this.sequence,
			}));
		} else {
			console.log("Didn't receive heartbeat Ack!")
			this.attemptReconnect()
		}
		this.receivedAck = false
		this.lastPingTimestamp = Date.now()
	}

	private heartbeat: any;

	private async identify() {
		await this.sock.send(JSON.stringify({
			op: 2,
			d: {
				token: this.token,
				intents: this.client.options.intents,
				properties: {
					"$os": "linux",
					"$browser": "coward",
					"$device": "coward",
				},
			},
		}));
	}

	public async modifyPresence(settings: any) {
		await this.sock.send(JSON.stringify({
			op: 3,
			d: {
				afk: false,
				game: settings.game,
				status: settings.status,
				since: (settings.status === "idle") ? Date.now() : 0
			}
		}))
	}

	private async handleWSMessage(message: any) {
		if(message.s) {
			this.sequence = message.s
		}

		switch (message.op) {
			/** case 1:
				this.sock.send(JSON.stringify({
					op: 1,
					d: this.sequence,
				}));
				break; **/
			case 7:
				this.attemptReconnect() // Don't close the connection lol
				break
			case 10:
				this.heartbeatInt = message.d.heartbeat_interval
				this.heartbeat = setInterval(() => {
					try {
						this.singleHeartbeat()
					} catch (err) {
						fear("error", "something went wrong when trying to heartbeat \n" + red(err.stack))
					}
				}, this.heartbeatInt)
				break;
			case 11:
				this.receivedAck = true
				this.ping = Date.now() - this.lastPingTimestamp
				break
		}

		handleEvent(this.client, message)
	}

	public async close() {
		this.receivedAck = true
		if (this.heartbeat) clearInterval(this.heartbeat)
		if (!this.sock.isClosed) this.sock.close(1000)
	}

	private async onClose(message: any) {
		this.status = "disconnected"
		this.close()
		console.log(message.code)
		if (message.code) {
			switch (message.code) {
				case 4000: // unknown error
				case 4007: // invalid seq
				case 4008: // ratelimited ?
				case 4009: // session timed out
					this.status = "reconnecting"
					this.connect()
				case 4001:
					fear("error",
						"Unknown Opcode: You sent an invalid Gateway opcode or an invalid payload for an opcode. Don't do that!",
					);
					break;
				case 4002:
					fear("error",
						"Decode Error: You sent an invalid payload to us. Don't do that!",
					);
					break;
				case 4003:
					fear("error",
						"Not Authenticated: You sent us a payload prior to identifying.",
					);
					break;
				case 4004:
					fear("error",
						`Authentication Failed: The account token sent with your identify payload is incorrect. (${this.token})`,
					);
					break;
				case 4005:
					fear("error",
						"Already Authenticated: You sent more than one identify payload. Don't do that!",
					);
					break;
				case 4010:
					fear("error",
						"Invalid Shard: You sent us an invalid shard when identifying.",
					);
					break;
				case 4011:
					fear("error",
						"Sharding Required: The session would have handled too many guilds - you are required to shard your connection in order to connect.",
					);
					break;
				case 4012:
					fear("error",
						"Invalid API Version: You sent an invalid version for the gateway.",
					);
					break;
				case 4013:
					fear("error",
						"Invalid Intent(s): You sent an invalid intent for a Gateway Intent. You may have incorrectly calculated the bitwise value.",
					);
					break;
				case 4014:
					fear("error",
						"Disallowed Intent(s): You sent a disallowed intent for a Gateway Intent. You may have tried to specify an intent that you have not enabled or are not whitelisted for.",
					);
					break;
			}
		}
	}
}
