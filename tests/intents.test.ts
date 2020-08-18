import { Client } from "../mod.ts";
import { Emitter } from "../src/util/Emitter.ts";

import { config } from "https://deno.land/x/dotenv@v0.5.0/mod.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.63.0/testing/asserts.ts";

const { DISCORD_TOKEN = "" } = { ...config(), ...Deno.env.toObject() };

Deno.test("empty intents", async () => {
  const bot = new Client(DISCORD_TOKEN, {
    intents: [],
  });

  assertEquals(bot.eventsByIntents, {});
});

Deno.test("get events by intents", async () => {
  const bot = new Client(DISCORD_TOKEN, {
    intents: ["GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
  });

  const intentNames = {
    GUILD_MESSAGES: [
      "messageCreate",
      "messageUpdate",
      "messageDelete",
      "messageDeleteBulk",
    ],
    GUILD_MESSAGE_REACTIONS: [
      "messageReactionAdd",
      "messageReactionRemove",
      "messageReactionRemoveAll",
    ],
  } as const;
  for (const [name, intent] of Object.entries(bot.eventsByIntents)) {
    assertEquals(
      Object.keys(intent),
      intentNames[name as keyof typeof intentNames],
    );
    for (const emitter of Object.values(intent)) {
      assert(emitter instanceof Emitter);
    }
  }
});
