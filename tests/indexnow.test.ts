import assert from "node:assert/strict";
import test from "node:test";
import { pagePathsToUrls } from "../lib/indexnow";
import { changedUrls, parseSitemap } from "../scripts/indexnow-diff.mjs";

const xml = (rows: [string, string?][]) =>
  `<urlset>${rows
    .map(
      ([loc, lastmod]) =>
        `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`,
    )
    .join("")}</urlset>`;

test("changedUrls returns new URLs and changed lastmod only", () => {
  const previous = parseSitemap(
    xml([["https://a/", "1"], ["https://b/", "1"], ["https://c/"]]),
  );
  const current = parseSitemap(
    xml([["https://a/", "1"], ["https://b/", "2"], ["https://c/"], ["https://d/", "1"]]),
  );
  assert.deepEqual(changedUrls(current, previous), ["https://b/", "https://d/"]);
  assert.deepEqual(changedUrls(current, current), []);
});

test("changedUrls submits everything without a snapshot", () => {
  const current = parseSitemap(xml([["https://a/", "1"], ["https://b/", "2"]]));
  assert.deepEqual(changedUrls(current, null), ["https://a/", "https://b/"]);
});

test("pagePathsToUrls keeps page paths and drops sitemap/feed", () => {
  assert.deepEqual(
    pagePathsToUrls(
      new Set(["/", "/blog/x/", "/blog/feed.xml", "/sitemap.xml"]),
      "https://horacal.app",
    ),
    ["https://horacal.app/", "https://horacal.app/blog/x/"],
  );
});
