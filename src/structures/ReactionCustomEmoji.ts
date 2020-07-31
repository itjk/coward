import { Client } from "../Client.ts";
import { ReactionStandardEmoji } from "./ReactionStandardEmoji.ts";

/**
 * Class representing a custom reaction emoji
 * @extends ReactionStandardEmoji
 */
export class ReactionCustomEmoji extends ReactionStandardEmoji {
  public animateable: boolean;

  constructor(data: any, protected client: Client) {
    super(data, client);
    this.animateable = data.animateable || false;
  }
}
