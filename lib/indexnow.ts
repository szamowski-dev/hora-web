const HOST = "horacal.app";
const KEY = "3857bebade48c515e65bbdf3fea1dedb";
const ENDPOINT = "https://api.indexnow.org/IndexNow";
const REQUEST_TIMEOUT_MS = 10_000;

/** Public page paths only: trailing-slash routes, no sitemap/feed files. */
export function pagePathsToUrls(paths: Iterable<string>, baseUrl: string) {
  return [...paths]
    .filter((path) => path.endsWith("/"))
    .map((path) => new URL(path, baseUrl).toString());
}

/** Best-effort IndexNow ping; logs failures and never throws. */
export async function submitToIndexNow(urls: string[]) {
  if (urls.length === 0) return;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `https://${HOST}/${KEY}.txt`,
        urlList: urls,
      }),
    });
    if (!res.ok) console.error(`IndexNow submit failed: ${res.status}`);
  } catch (error) {
    console.error("IndexNow submit failed", error);
  }
}
