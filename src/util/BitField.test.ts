import { assert } from "https://deno.land/std@0.63.0/testing/asserts.ts";
import { BitField } from "./BitField.ts";

const flags = new Map(Object.entries({
  A: 1,
  B: 2,
  C: 4,
  D: 8,
}));

const flagNumbers = new Array(2 ** flags.size).keys();

Deno.test("simple bitfield", async () => {
  const b = new BitField("C", flags);
  assert(!b.has("A"));
  assert(!b.has("B"));
  assert(b.has("C"));
  assert(!b.has("D"));

  for (const n of flagNumbers) {
    if ((n & 4) === n) {
      assert(b.has(n), `the bitfield must have ${n}`);
    } else {
      assert(!b.has(n), `the bitfield must not have ${n}`);
    }
  }
});

Deno.test("bitfield by strings", () => {
  const b = new BitField(["A", "B"], flags);
  assert(b.has("A"));
  assert(b.has("B"));
  assert(!b.has("C"));
  assert(!b.has("D"));
});

Deno.test("bitfield by numbers", () => {
  const b = new BitField(3, flags);

  for (const n of flagNumbers) {
    if ((n & 3) === n) {
      assert(b.has(n), `the bitfield must have ${n}`);
    } else {
      assert(!b.has(n), `the bitfield must not have ${n}`);
    }
  }
});

Deno.test("bitfield by another bitfield", () => {
  const b1 = new BitField(3, flags);
  const b2 = new BitField(1, flags);

  assert(b1.has(b2));
  assert(!b2.has(b1));
  assert(b1.has(b1));
  assert(b2.has(b2));
});
