import { UserFlag } from "../util/UserFlags.ts";

/** Class representing a user */
export class User {
  public id: string;
  public username: string;
  public discriminator: string;
  public bot: boolean;
  public public_flags: UserFlag;
  public flags: UserFlag;

  constructor(data: any) {
    this.id = data.id;
    this.public_flags = new UserFlag(data.public_flags || 0);
    this.flags = new UserFlag(data.flags || 0);
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.bot = data.bot || false;
  }
}
