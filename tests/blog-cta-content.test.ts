import assert from "node:assert/strict";
import test from "node:test";
import { defaultBlogCta } from "../content/blog-cta";
import { mapBlogCtaSettings } from "../lib/blog-cta-content";

test("falls back to the packaged copy when the document is missing", () => {
  const content = mapBlogCtaSettings(null);
  assert.deepEqual(content, defaultBlogCta);
});

test("keeps packaged copy for blank Sanity strings", () => {
  const content = mapBlogCtaSettings({
    ctaLabel: "   ",
    band: { heading: "", body: "  " },
  });
  assert.equal(content.ctaLabel, defaultBlogCta.ctaLabel);
  assert.equal(content.band.heading, defaultBlogCta.band.heading);
  assert.equal(content.band.body, defaultBlogCta.band.body);
});

test("editors can turn a single banner off without touching the others", () => {
  const content = mapBlogCtaSettings({
    rail: { enabled: false },
    aside: { heading: "Put hora on your Mac" },
  });
  assert.equal(content.rail.enabled, false);
  assert.equal(content.aside.enabled, true);
  assert.equal(content.band.enabled, true);
  assert.equal(content.aside.heading, "Put hora on your Mac");
  assert.equal(content.rail.heading, defaultBlogCta.rail.heading);
});

test("showHomebrew stays false when an editor disables it", () => {
  assert.equal(mapBlogCtaSettings({ showHomebrew: false }).showHomebrew, false);
  assert.equal(
    mapBlogCtaSettings({}).showHomebrew,
    defaultBlogCta.showHomebrew,
  );
});
