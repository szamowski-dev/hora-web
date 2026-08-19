import assert from "node:assert/strict";
import test from "node:test";
import {
  DIRECT_LATEST_MANIFEST_PATH,
  resolveLatestDirectDownload,
  validateDirectReleaseManifest,
} from "../lib/direct/download";

const version = "1.2.3";
const build = "123";
const fileName = `hora-calendar-${version}-${build}.zip`;
const zipUrl =
  `https://downloads.horacal.app/direct/stable/releases/${version}/` +
  `${build}/${fileName}`;
const checksum = "a".repeat(64);
const dmgFileName = `hora-calendar-${version}-${build}.dmg`;
const dmgUrl =
  `https://downloads.horacal.app/direct/stable/releases/${version}/` +
  `${build}/${dmgFileName}`;

const validManifest = {
  marketing_version: version,
  build_number: build,
  source_sha: "b".repeat(40),
  zip_url: zipUrl,
  zip_sha256: checksum,
  appcast_sha256: "c".repeat(64),
  appcast_url: "https://downloads.horacal.app/direct/stable/appcast.xml",
  generated_at: "2026-08-03T12:30:00Z",
};

function response(body: string, contentType: string) {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(new TextEncoder().encode(body).byteLength),
    },
  });
}

test("resolves the published manifest to its immutable ZIP", async () => {
  const requests: Array<{ cache?: RequestCache; url: string }> = [];
  const fetcher = async (input: string | URL, init?: RequestInit) => {
    const url = String(input);
    requests.push({ cache: init?.cache, url });
    if (url.endsWith(DIRECT_LATEST_MANIFEST_PATH)) {
      return response(JSON.stringify(validManifest), "application/json");
    }
    if (url === `${zipUrl}.sha256`) {
      return response(`${checksum}  ${fileName}\n`, "text/plain");
    }
    return new Response(null, { status: 404 });
  };

  const resolved = await resolveLatestDirectDownload({ fetcher });

  assert.equal(resolved.href, zipUrl);
  assert.deepEqual(requests, [
    {
      cache: "no-store",
      url: "https://downloads.horacal.app/direct/stable/latest.json",
    },
    { cache: "no-store", url: `${zipUrl}.sha256` },
  ]);
});

test("resolves the immutable website DMG manifest", async () => {
  const legacyManifest = {
    marketing_version: version,
    build_number: build,
    source_sha: "b".repeat(40),
    dmg_url: dmgUrl,
    dmg_sha256: checksum,
    appcast_sha256: "c".repeat(64),
    appcast_url: "https://downloads.horacal.app/direct/stable/appcast.xml",
    generated_at: "2026-08-03T12:30:00Z",
  };
  const fetcher = async (input: string | URL) => {
    const url = String(input);
    if (url.endsWith(DIRECT_LATEST_MANIFEST_PATH)) {
      return response(JSON.stringify(legacyManifest), "application/json");
    }
    if (url === `${dmgUrl}.sha256`) {
      return response(`${checksum}  ${dmgFileName}\n`, "text/plain");
    }
    return new Response(null, { status: 404 });
  };

  const resolved = await resolveLatestDirectDownload({ fetcher });
  assert.equal(resolved.href, dmgUrl);
});

test("rejects mutable, foreign and mismatched ZIP URLs", () => {
  const invalidUrls = [
    "https://downloads.horacal.app/direct/stable/latest.zip",
    `https://evil.example/direct/stable/releases/${version}/${build}/${fileName}`,
    `https://downloads.horacal.app/direct/stable/releases/9.9.9/${build}/${fileName}`,
    `${zipUrl}?download=1`,
    `${zipUrl}#release`,
  ];

  for (const invalidUrl of invalidUrls) {
    assert.throws(() =>
      validateDirectReleaseManifest({
        ...validManifest,
        zip_url: invalidUrl,
      }),
    );
  }
});

test("rejects invalid manifest integrity fields", () => {
  assert.throws(() =>
    validateDirectReleaseManifest({
      ...validManifest,
      zip_sha256: "not-a-checksum",
    }),
  );
  assert.throws(() =>
    validateDirectReleaseManifest({
      ...validManifest,
      source_sha: "d".repeat(39),
    }),
  );
  assert.throws(() =>
    validateDirectReleaseManifest({
      ...validManifest,
      generated_at: "tomorrow",
    }),
  );
});

test("rejects a checksum response that does not match the manifest", async () => {
  const fetcher = async (input: string | URL) => {
    const url = String(input);
    if (url.endsWith(DIRECT_LATEST_MANIFEST_PATH)) {
      return response(JSON.stringify(validManifest), "application/json");
    }
    return response(`${"f".repeat(64)}  ${fileName}\n`, "text/plain");
  };

  await assert.rejects(() => resolveLatestDirectDownload({ fetcher }));
});

test("rejects untrusted base URLs before making a request", async () => {
  let called = false;
  const fetcher = async () => {
    called = true;
    return new Response(null, { status: 500 });
  };

  await assert.rejects(() =>
    resolveLatestDirectDownload({
      baseUrl: "https://downloads.horacal.app.evil.example",
      fetcher,
    }),
  );
  assert.equal(called, false);
});

test("rejects malformed and oversized manifests", async () => {
  const malformedFetcher = async () => response("{", "application/json");
  await assert.rejects(() =>
    resolveLatestDirectDownload({ fetcher: malformedFetcher }),
  );

  const oversizedFetcher = async () =>
    response("x".repeat(16 * 1024 + 1), "application/json");
  await assert.rejects(() =>
    resolveLatestDirectDownload({ fetcher: oversizedFetcher }),
  );
});
