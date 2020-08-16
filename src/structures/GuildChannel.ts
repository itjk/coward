import type { ModifyChannel } from "./Options.ts";
import { Channel } from "./Channel.ts";
import type { Guild } from "./Guild.ts";
import { PermissionOverwrite } from "./PermissionOverwrite.ts";
import type {
  GuildChannelAssociation,
  Guilds,
} from "./Delegates.ts";
import type { Messages, Channels } from "./Handlers.ts";

export type GuildChannelCache =
  & Guilds
  & GuildChannelAssociation;

export type GuildChannelHandler = Messages & Channels;

/**
 * Class representing a channel in a guild
 * @extends Channel
 */
export class GuildChannel extends Channel {
  public readonly name: string;
  public readonly position: number;
  public readonly nsfw: boolean;
  public readonly parentID: string; // TODO(fox-cat): channel category object ????
  public readonly permission_overwrites: Map<string, PermissionOverwrite>;
  protected readonly _guildID: string | undefined;

  constructor(
    data: any,
    private readonly cache: GuildChannelCache,
    private readonly handler: GuildChannelHandler,
  ) {
    super(data);

    this.name = data.name;
    this.position = data.position;
    this.nsfw = data.nsfw;
    this.parentID = data.parent_id || null;
    this._guildID = cache.getGuildId(this.id);

    this.permission_overwrites = new Map<string, PermissionOverwrite>();
    for (const permission_overwrite of data.permission_overwrites) {
      const perms = new PermissionOverwrite(permission_overwrite);
      this.permission_overwrites.set(perms.id, perms);
    }
  }

  get guild(): Guild | undefined {
    return this.cache.getGuild(this._guildID ?? "");
  }

  delete() {
    return this.handler.deleteChannel(this.id);
  }

  modify(options: ModifyChannel) {
    return this.handler.modifyChannel(this.id, options);
  }
}
