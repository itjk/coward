import { Client } from "../Client.ts";

/** Class representing a standard reaction emoji */
export class ReactionStandardEmoji {
  public id: string;
  public name: string;

  constructor(data: any, protected client: Client) {
    this.id = data.id;
    this.name = data.name || null;
  }
}
