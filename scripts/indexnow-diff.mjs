// Pure sitemap helpers shared by scripts/indexnow.mjs and its unit test.

/** Parses `<url><loc>/<lastmod>` pairs into a { loc: lastmod } map. */
export function parseSitemap(xml) {
  const entries = {};
  for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (loc) entries[loc] = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? "";
  }
  return entries;
}

/** URLs that are new or whose lastmod changed; everything when no snapshot. */
export function changedUrls(current, previous) {
  const urls = Object.keys(current);
  return previous ? urls.filter((u) => previous[u] !== current[u]) : urls;
}
