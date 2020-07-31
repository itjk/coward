export type BitFieldResolvable =
  | string
  | BitField
  | number
  | BitFieldResolvable[];

/** Base class for places where the discord API uses bitfields  */
export class BitField {
  flags: Map<string, number>;
  bitfield: number;

  constructor(bitfield: BitFieldResolvable) {
    this.bitfield = this.resolve(bitfield);
    this.flags = new Map<string, number>();
  }

  has(bit: BitFieldResolvable): boolean {
    if (Array.isArray(bit)) return bit.every((b) => this.has(b));
    bit = this.resolve(bit);
    return (this.resolve(this.bitfield) & bit) === bit;
  }

  resolve(bit: BitFieldResolvable): number {
    if (typeof bit === "number" && bit >= 0) return bit;
    if (bit instanceof BitField) return this.resolve(bit.bitfield);
    if (Array.isArray(bit)) {
      return bit.map((p) => this.resolve(p)).reduce((prev, p) => prev | p, 0);
    }
    if (typeof bit === "string" && this.flags.get(bit)) {
      return this.flags.get(bit)!;
    }
    throw new RangeError("INVALID_BIT");
  }

  add(...bits: BitFieldResolvable[]) {
    let newBits = 0;

    for (const bit of bits) {
      newBits |= this.resolve(bit);
    }

    this.bitfield |= newBits;
  }

  toArray() {
    let bits = [];

    for (let flag of this.flags) {
      if (this.has(flag[0])) bits.push(flag[0]);
    }

    return bits;
  }
}
