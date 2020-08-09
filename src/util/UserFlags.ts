import { BitField } from "./BitField.ts";

export const UserFlags = new Map<string, number>([
  ["DISCORD_EMPLOYEE", 1 << 0],
  ["DISCORD_PARTNER", 1 << 1],
  ["HYPESQUAD_EVENTS", 1 << 2],
  ["BUG_HUNTER_LEVEL_ONE", 1 << 3],
  ["HOUSE_BRAVERY", 1 << 6],
  ["HOUSE_BRILLIANCE", 1 << 7],
  ["HOUSE_BALANCE", 1 << 8],
  ["EARLY_SUPPORTER", 1 << 9],
  ["TEAM_USER", 1 << 10],
  ["SYSTEM", 1 << 12],
  ["BUG_HUNTER_LEVEL_TWO", 1 << 14],
  ["VERIFIED_BOT", 1 << 16],
  ["VERIFIED_BOT_DEVELOPER", 1 << 17],
]);

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
    super(userFlags, UserFlags);
  }

  has(flag: UserFlagResolvable) {
    return super.has(flag);
  }

  add(...bits: UserFlagResolvable[]) {
    super.add(bits);
  }
}
