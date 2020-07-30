import { Client } from "../mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const { DISCORD_TOKEN } = config();

Deno.test("Connects to discord and emits ready event", async () => {
	const bot = new Client(DISCORD_TOKEN);
		
	bot.events.ready.on(() => {
		bot.disconnect();
	});
	
	bot.connect();
});
