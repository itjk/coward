import { Client } from "../mod.ts";

const configData = await Deno.readFile("./config.json");
const decoder = new TextDecoder("utf-8");
const configText = decoder.decode(configData);
const config = JSON.parse(configText);
const { token } = config;

Deno.test("Connects to discord and emits ready event", async () => {
	const bot = new Client(token);
		
	bot.evt.ready.attach(() => {
		bot.disconnect();
	});
	
	await bot.gateway.connect();
});