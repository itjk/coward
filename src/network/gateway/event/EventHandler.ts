import { Client } from "../../../Client.ts";
import { Payload } from "../Payload.ts";
import { Emitter } from "../../../util/Emitter.ts";
import { handleChannelEvent, RoleEventSubscriber } from "./handler/Channel.ts";
import { handleGuildEvent, GuildEventSubscriber } from "./handler/Guild.ts";
import {
  handleMessageEvent,
  MessageEventSubscriber,
} from "./handler/Message.ts";
import { GuildDB, ChannelDB } from "../Event.ts";

export interface EventSubscriber
  extends RoleEventSubscriber, GuildEventSubscriber, MessageEventSubscriber {
  ready: Emitter<unknown>;
}

export function handleEvent(
  client: Client,
  message: Payload,
  subscriber: EventSubscriber,
  database: GuildDB & ChannelDB,
) {
  if (message.t.startsWith("CHANNEL_")) {
    handleChannelEvent(
      message,
      subscriber,
      database,
      client,
    );
    return;
  }
  if (message.t.startsWith("GUILD_")) {
    handleGuildEvent(
      client,
      message,
      subscriber,
      database,
    );
    return;
  }
  if (message.t.startsWith("MESSAGE_")) {
    handleMessageEvent(client, message, subscriber);
    return;
  }
  const type = message.t;
  switch (type) {
    case "READY": {
      subscriber.ready.emit({ type });
      return;
    }
      // TODO: invites
      // TODO: TYPING_START
  }
}
