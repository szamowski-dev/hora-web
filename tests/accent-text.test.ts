import assert from "node:assert/strict";
import test from "node:test";
import { splitHeadline } from "../lib/accent-text";

test("splitHeadline balances the live hero headline", () => {
  assert.deepEqual(splitHeadline("The Mac Calendar Google never built."), {
    lead: "The Mac Calendar",
    accent: "Google never built.",
  });
});

test("splitHeadline prefers explicit line breaks and sentences", () => {
  assert.deepEqual(splitHeadline("Stop living\nin a browser tab."), {
    lead: "Stop living",
    accent: "in a browser tab.",
  });
  assert.deepEqual(splitHeadline("Find a time. Skip the back-and-forth."), {
    lead: "Find a time.",
    accent: "Skip the back-and-forth.",
  });
});

test("splitHeadline leaves short or empty headlines alone", () => {
  assert.equal(splitHeadline("hora"), null);
  assert.equal(splitHeadline("Native calendar"), null);
  assert.equal(splitHeadline(""), null);
  assert.equal(splitHeadline(undefined), null);
});
