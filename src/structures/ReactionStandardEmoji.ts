/** Class representing a standard reaction emoji */
export class ReactionStandardEmoji {
  public id: string;
  public name: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name || null;
  }
}
