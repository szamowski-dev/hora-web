#!/usr/bin/env node
// Submits new/changed sitemap URLs to IndexNow (diff vs. the last snapshot).
// Run after a production deploy: `pnpm indexnow`.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { changedUrls, parseSitemap } from "./indexnow-diff.mjs";

const HOST = "horacal.app";
const KEY = "3857bebade48c515e65bbdf3fea1dedb";
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";
const MAX_ATTEMPTS = 5;
const REQUEST_TIMEOUT_MS = 45_000;
const SNAPSHOT_PATH =
  process.env.INDEXNOW_SNAPSHOT ?? ".indexnow/sitemap-snapshot.json";

async function fetchSitemap() {
  const res = await fetch(SITEMAP_URL, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  return res.text();
}

async function readSnapshot() {
  try {
    return JSON.parse(await readFile(SNAPSHOT_PATH, "utf8"));
  } catch {
    return null; // first run or unreadable snapshot: submit everything
  }
}

async function writeSnapshot(entries) {
  await mkdir(dirname(SNAPSHOT_PATH), { recursive: true });
  await writeFile(SNAPSHOT_PATH, JSON.stringify(entries, null, 2));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function responsePreview(body) {
  return body.replace(/\s+/g, " ").trim().slice(0, 500);
}

function retryDelayMs(res, attempt) {
  const retryAfter = res.headers.get("retry-after");
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds)) return seconds * 1000;

    const date = Date.parse(retryAfter);
    if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
  }

  return Math.min(30_000, 2 ** attempt * 1000);
}

function shouldRetry(status) {
  return status === 429 || status >= 500;
}

async function postUrls(urls) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    }),
  });
  return { status: res.status, headers: res.headers, body: await res.text() };
}

async function submit(urls) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    let res;
    try {
      res = await postUrls(urls);
    } catch (error) {
      console.log(`IndexNow attempt ${attempt}/${MAX_ATTEMPTS} failed: ${error.message}`);
      if (attempt === MAX_ATTEMPTS) throw error;

      const delay = retryDelayMs({ headers: { get: () => null } }, attempt);
      console.log(`Retrying IndexNow in ${Math.round(delay / 1000)}s...`);
      await sleep(delay);
      continue;
    }

    const body = responsePreview(res.body);
    const suffix = body ? ` ${body}` : "";
    console.log(`IndexNow attempt ${attempt}/${MAX_ATTEMPTS} -> ${res.status}${suffix}`);

    if (res.status >= 200 && res.status < 300) return res;
    if (!shouldRetry(res.status) || attempt === MAX_ATTEMPTS) return res;
    const delay = retryDelayMs(res, attempt);
    console.log(`Retrying IndexNow in ${Math.round(delay / 1000)}s...`);
    await sleep(delay);
  }
}

const current = parseSitemap(await fetchSitemap());
if (Object.keys(current).length === 0) {
  console.error("No URLs found in sitemap");
  process.exit(1);
}
const urls = changedUrls(current, await readSnapshot());
if (urls.length === 0) {
  console.log("No sitemap changes since last snapshot; nothing to submit.");
  await writeSnapshot(current);
  process.exit(0);
}
console.log(`Submitting ${urls.length} changed URLs to IndexNow…`);
const result = await submit(urls);
if (result.status < 200 || result.status >= 300) process.exit(1);
await writeSnapshot(current);
