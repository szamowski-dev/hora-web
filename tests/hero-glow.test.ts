import assert from "node:assert/strict";
import test from "node:test";
import { defaultHeroGlow, resolveHeroGlow } from "../lib/hero-glow";

test("hero glow preserves defaults, independent controls, and safe bounds", () => {
  assert.deepEqual(resolveHeroGlow(), defaultHeroGlow);
  assert.deepEqual(resolveHeroGlow({ purple: 0, pink: 100 }), { purple: 0, pink: 100, blue: 50 });
  assert.deepEqual(resolveHeroGlow({ purple: -10, pink: 120, blue: NaN }), { purple: 0, pink: 100, blue: 50 });
  assert.deepEqual(resolveHeroGlow({ purple: Infinity }), defaultHeroGlow);
});
