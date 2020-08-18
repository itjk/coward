export type BitFieldResolvable =
  | string
  | BitField
  | number
  | BitFieldResolvable[];

/** Base class for places where the discord API uses bitfields  */
export class BitField {
  bitfield: number;

  constructor(
    bitfield: BitFieldResolvable,
    public readonly flags = new Map<string, number>(),
  ) {
    this.bitfield = this.resolve(bitfield);
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
    this.bitfield |= bits.reduce(
      (prev: number, bit) => prev | this.resolve(bit),
      0,
    );
  }

  toArray() {
    return [...this.flags.keys()].filter(this.has.bind(this));
  }
}
