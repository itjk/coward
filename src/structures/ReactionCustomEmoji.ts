import { ReactionStandardEmoji } from "./ReactionStandardEmoji.ts";

/**
 * Class representing a custom reaction emoji
 * @extends ReactionStandardEmoji
 */
export class ReactionCustomEmoji extends ReactionStandardEmoji {
  public animateable: boolean;

  constructor(data: any) {
    super(data);
    this.animateable = data.animateable || false;
  }
}
