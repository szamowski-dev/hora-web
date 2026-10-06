import assert from "node:assert/strict";
import test from "node:test";
import { findKeyword, splitHeadline, splitTail } from "../lib/accent-text";

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

test("splitTail accents the trailing phrase", () => {
  assert.deepEqual(splitTail("Built by hora Calendar"), {
    lead: "Built by",
    accent: "hora Calendar",
  });
  assert.equal(splitTail("Featured on"), null);
});

test("findKeyword matches whole words and keeps the original text", () => {
  const keywords = { "color-coded calendars": "calendars", "meet and contacts": "meet" };
  assert.deepEqual(findKeyword("Color-coded calendars", keywords), {
    before: "Color-coded ",
    keyword: "calendars",
    after: "",
  });
  assert.deepEqual(findKeyword("Meet and Contacts", keywords), {
    before: "",
    keyword: "Meet",
    after: " and Contacts",
  });
  assert.equal(findKeyword("Unknown title", keywords), null);
});
