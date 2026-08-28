import assert from "node:assert/strict";
import test from "node:test";
import { requiresCookieConsent } from "../lib/consent-policy";

test("requires consent for regulated countries and unknown locations", () => {
  assert.equal(requiresCookieConsent("PL"), true);
  assert.equal(requiresCookieConsent("gb"), true);
  assert.equal(requiresCookieConsent(null), true);
});

test("does not require consent for a Vercel-resolved US visitor", () => {
  assert.equal(requiresCookieConsent("US"), false);
});
