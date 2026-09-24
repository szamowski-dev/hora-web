import assert from "node:assert/strict";
import test from "node:test";
import { defaultGoogleCalendarMacPage } from "../content/google-calendar-mac";
import { resolveSitemapPageMetadata } from "../sanity/lib/sitemap-page-dates";

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

test("resolveSitemapPageMetadata keeps every page when CMS fields are present", () => {
  const resolved = resolveSitemapPageMetadata({
    home: { lastModified: "2026-09-24T07:55:57Z", noIndex: false },
    features: { lastModified: "2026-09-01T12:00:00.000Z", noIndex: false },
    about: { lastModified: "2026-08-15T01:02:03Z", noIndex: true },
    googleCalendarMac: {
      lastModified: "2026-09-17T10:00:00Z",
      noIndex: false,
    },
    privacy: { lastModified: "2026-05-01", noIndex: false },
    terms: { lastModified: "2026-05-01", noIndex: false },
    refunds: { lastModified: "2026-06-01", noIndex: false },
    trust: { lastModified: "2026-07-01", noIndex: false },
  });

  assert.equal(resolved.home.lastModified, "2026-09-24T07:55:57Z");
  assert.equal(resolved.features.lastModified, "2026-09-01T12:00:00.000Z");
  assert.equal(resolved.about.noIndex, true);
  assert.equal(resolved.privacy.lastModified, "2026-05-01");
  assert.equal(resolved.googleCalendarMac.lastModified, "2026-09-17T10:00:00Z");
});

test("resolveSitemapPageMetadata never throws on null, missing, or invalid CMS data", () => {
  const resolved = resolveSitemapPageMetadata(null);

  for (const key of [
    "home",
    "features",
    "about",
    "googleCalendarMac",
  ] as const) {
    assert.match(resolved[key].lastModified, ISO);
    assert.equal(resolved[key].noIndex, false);
  }

  for (const key of ["privacy", "terms", "refunds", "trust"] as const) {
    assert.match(resolved[key].lastModified, DATE);
    assert.equal(resolved[key].noIndex, false);
  }

  assert.equal(
    resolved.googleCalendarMac.lastModified,
    defaultGoogleCalendarMacPage.updatedAt,
  );

  const degraded = resolveSitemapPageMetadata({
    home: { lastModified: "not-a-date", noIndex: true },
    privacy: { lastModified: "2026/05/01", noIndex: false },
  });

  assert.match(degraded.home.lastModified, ISO);
  assert.equal(degraded.home.noIndex, true);
  assert.match(degraded.privacy.lastModified, DATE);
});
