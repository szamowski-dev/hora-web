import assert from "node:assert/strict";
import test from "node:test";
import { utmAttributionFromSearchParams } from "../lib/appStoreCampaign";
import { normalizeUtmMedium } from "../lib/utm";

test("normalizes UTM medium casing, whitespace and trailing separators", () => {
  assert.equal(normalizeUtmMedium(" Google/ "), "google");
  assert.equal(normalizeUtmMedium("google///"), "google");
  assert.equal(normalizeUtmMedium("CPC\\\\"), "cpc");
  assert.equal(normalizeUtmMedium("cpc/\\\\/"), "cpc");
  assert.equal(normalizeUtmMedium("  CPC  "), "cpc");
});

test("does not turn an empty medium into a tracked value", () => {
  assert.equal(normalizeUtmMedium(" /\\\\ "), undefined);
  assert.equal(normalizeUtmMedium(null), undefined);
});

test("uses the normalized UTM medium for App Store attribution", () => {
  const attribution = utmAttributionFromSearchParams(
    new URLSearchParams("utm_source=Google&utm_medium=Google/%20"),
  );

  assert.equal(attribution.medium, "google");
});
