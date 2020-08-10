import type { Payload } from "../Payload.ts";
import type { Emitter } from "../../../util/Emitter.ts";
import { handleChannelEvent, RoleEventSubscriber } from "./handler/Channel.ts";
import { handleGuildEvent, GuildEventSubscriber } from "./handler/Guild.ts";
import {
  handleMessageEvent,
  MessageEventSubscriber,
} from "./handler/Message.ts";
import type { GuildClient, GuildHandler } from "../../../structures/Guild.ts";
import type { MessageClient } from "../../../structures/Message.ts";

export interface EventSubscriber
  extends RoleEventSubscriber, GuildEventSubscriber, MessageEventSubscriber {
  ready: Emitter<unknown>;
}

export function handleEvent(
  message: Payload,
  delegates: Readonly<{
    client: GuildClient & MessageClient;
    handler: GuildHandler;
    subscriber: EventSubscriber;
  }>,
) {
  const type = message.t;
  if (!type) return;

  if (type.startsWith("CHANNEL_")) {
    handleChannelEvent(
      message,
      delegates,
    );
    return;
  }
  if (type.startsWith("GUILD_")) {
    handleGuildEvent(
      message,
      delegates,
    );
    return;
  }
  if (type.startsWith("MESSAGE_")) {
    handleMessageEvent(message, delegates);
    return;
  }
  switch (type) {
    case "READY": {
      delegates.subscriber.ready.emit({ type });
      return;
    }
      // TODO: invites
      // TODO: TYPING_START
  }
}
