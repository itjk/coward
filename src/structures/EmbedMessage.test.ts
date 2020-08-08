import { assertEquals } from "https://deno.land/std@0.63.0/testing/asserts.ts";
import { EmbedMessageBuilder, EmbedMessage } from "./EmbedMessage.ts";

Deno.test("simple embed", () => {
  const mes = new EmbedMessageBuilder()
    .title("Simple Embed")
    .description("The simple embed message here!")
    .color(0xb92bac)
    .url("https://example.com")
    .author({
      name: "fox-cat",
      url: "https://confuck.com/",
      icon_url: "https://github.com/fox-cat.png",
    })
    .footer({
      text: "The quick brown fox-cat jumps over the lazy dog",
      icon_url: "https://github.com/fox-cat.png",
    });

  const expected: EmbedMessage = {
    title: "Simple Embed",
    description: "The simple embed message here!",
    url: "https://example.com",
    color: 0xb92bac,
    footer: {
      text: "The quick brown fox-cat jumps over the lazy dog",
      icon_url: "https://github.com/fox-cat.png",
    },
    author: {
      name: "fox-cat",
      url: "https://confuck.com/",
      icon_url: "https://github.com/fox-cat.png",
    },
  };
  assertEquals(mes.build(), expected);
});

Deno.test("some fields", async () => {
  const mes = new EmbedMessageBuilder().fields(
    {
      name: "1",
      value: "First item",
    },
    {
      name: "2",
      value: "Second item",
    },
  );

  const expected: EmbedMessage = {
    fields: [
      {
        name: "1",
        value: "First item",
      },
      {
        name: "2",
        value: "Second item",
      },
    ],
  };
  assertEquals(mes.build(), expected);
});
