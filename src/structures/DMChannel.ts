import { User } from "./User.ts";
import { TextChannelMixIn, TextChannel } from "./TextChannel.ts";
import { Channel } from "./Channel.ts";
import type { Messages } from "./Handlers.ts";

/**
 * Class representing a DM channel
 * @extends Channel
 */
class DMChannel_ extends Channel implements TextChannel {
  public readonly recipients: Array<User>;

  constructor(data: any, public readonly _messages: Messages) {
    super(data);

    this.recipients = (data.recipients as any[]).map((recipient) =>
      new User(recipient)
    );
  }
}
export class DMChannel extends TextChannelMixIn(DMChannel_) {}
