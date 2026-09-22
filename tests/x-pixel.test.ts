import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { X_PIXEL_ID } from "../lib/x-pixel";

test("configures the approved X pixel through its official loader", () => {
  const source = readFileSync(join(process.cwd(), "lib/x-pixel.ts"), "utf8");

  assert.equal(X_PIXEL_ID, "rf9ce");
  assert.match(source, /https:\/\/static\.ads-twitter\.com\/uwt\.js/);
  assert.match(source, /twq\("config", X_PIXEL_ID\)/);
});
