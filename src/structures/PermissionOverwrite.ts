import { Client } from "../Client.ts";

export class PermissionOverwrite {
  public type: string;
  public id: string;
  public deny_new: string;
  public deny: number;
  public allow_new: string;
  public allow: number;

  constructor(data: any, protected client: Client) {
    //this = {this, ...data};
    this.type = data.type;
    this.id = data.id;
    this.deny_new = data.deny_new;
    this.deny = data.deny;
    this.allow_new = data.allow_new;
    this.allow = data.allow;
  }
}
