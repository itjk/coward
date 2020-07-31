import { Client, Options } from "../Client.ts";
import { Channel } from "./Channel.ts";
import { Guild } from "./Guild.ts";
import { PermissionOverwrite } from "./PermissionOverwrite.ts";

/**
 * Class representing a channel in a guild
 * @extends Channel
 */
export class GuildChannel extends Channel {
  public name: string;
  public position: number;
  public nsfw: boolean;
  public parentID: string; // TODO(fox-cat): channel category object ????
  public permission_overwrites: Map<string, PermissionOverwrite>;
  protected _guildID: any;

  constructor(data: any, client: Client) {
    super(data, client);

    this.name = data.name;
    this.position = data.position;
    this.nsfw = data.nsfw;
    this.parentID = data.parent_id || null;
    this._guildID = client.channelGuildIDs.get(this.id);

    this.permission_overwrites = new Map<string, PermissionOverwrite>();
    for (let permission_overwrite of data.permission_overwrites) {
      let perms = new PermissionOverwrite(permission_overwrite, client);
      this.permission_overwrites.set(perms.id, perms);
    }
  }

  get guild(): Guild | undefined {
    return this.client.guilds.get(this._guildID);
  }

  delete() {
    return this.client.deleteChannel(this.id);
  }

  modify(options: Options.modifyChannel) {
    return this.client.modifyChannel(this.id, options);
  }
}
