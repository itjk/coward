import { User } from "./User.ts";
import { TextChannelMixIn } from "./TextChannel.ts";
import { Channel } from "./Channel.ts";
import type { Messages } from "./Handlers.ts";

/**
 * Class representing a DM channel
 * @extends Channel
 */
export class DMChannel extends TextChannelMixIn(Channel) {
  public readonly recipients: Array<User>;

  constructor(data: any, client: Messages) {
    super(data, client);

    this.recipients = (data.recipients as any[]).map((recipient) =>
      new User(recipient)
    );
  }
}
