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

  const intentNames = [
    "messageCreate",
    "messageUpdate",
    "messageDelete",
    "messageDeleteBulk",
    "messageReactionAdd",
    "messageReactionRemove",
    "messageReactionRemoveAll",
  ] as const;
  assertEquals(
    Object.keys(bot.eventsByIntents),
    intentNames,
  );
  for (const emitter of Object.values(bot.eventsByIntents)) {
    assert(emitter instanceof Emitter);
  }
});
