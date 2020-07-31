import { BitField, BitFieldResolvable } from "./BitField.ts";
import { UserFlags } from "./Constants.ts";

type UserFlagType =
  | "DISCORD_EMPLOYEE"
  | "DISCORD_PARTNER"
  | "HYPESQUAD_EVENTS"
  | "BUG_HUNTER_LEVEL_ONE"
  | "HOUSE_BRAVERY"
  | "HOUSE_BRILLIANCE"
  | "HOUSE_BALANCE"
  | "EARLY_SUPPORTER"
  | "TEAM_USER"
  | "SYSTEM"
  | "BUG_HUNTER_LEVEL_TWO"
  | "VERIFIED_BOT"
  | "VERIFIED_BOT_DEVELOPER";

export type UserFlagResolvable =
  | UserFlagType
  | number
  | BitField
  | UserFlagResolvable[];

export class UserFlag extends BitField {
  constructor(userFlags: UserFlagResolvable) {
    super(userFlags);
    this.flags = UserFlags;
  }

  has(flag: UserFlagResolvable) {
    return super.has(flag);
  }

  add(...bits: UserFlagResolvable[]) {
    super.add(bits);
  }
}
