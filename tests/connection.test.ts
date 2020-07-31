import { Client } from "../mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const { DISCORD_TOKEN = "" } = { ...config(), ...Deno.env.toObject() };

Deno.test("Connects to discord and emits ready event", async () => {
  const bot = new Client(DISCORD_TOKEN);

  const disconnectTask = new Promise((resolve) =>
    bot.events.ready.on(async () => {
      await bot.disconnect();
      resolve();
    })
  );

  bot.connect();

  await disconnectTask;
});
