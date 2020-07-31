import { Client } from "https://deno.land/x/coward@dev/mod.ts";

const client = new Client("TOKEN");

const events = client.events;

events.ready.on(() => console.log("READY!"));

events.messageCreate.on(async ({ message }) => {
  if (message.content == "!ping") {
    await client.createMessage(message.channel.id, "pong!");
  }
});

client.connect();
