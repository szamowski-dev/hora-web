import { z } from "zod";

export const DIRECT_DOWNLOAD_ORIGIN = "https://downloads.horacal.app";
export const DIRECT_LATEST_MANIFEST_PATH = "/direct/stable/latest.json";

const DIRECT_APPCAST_URL = `${DIRECT_DOWNLOAD_ORIGIN}/direct/stable/appcast.xml`;
const MAX_MANIFEST_BYTES = 16 * 1024;
const MAX_CHECKSUM_BYTES = 512;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const SOURCE_SHA_PATTERN = /^[0-9a-f]{40}$/;
const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const BUILD_PATTERN = /^\d+$/;
const UTC_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

const releaseManifestBaseSchema = z.object({
  marketing_version: z.string().regex(VERSION_PATTERN),
  build_number: z.string().regex(BUILD_PATTERN),
  source_sha: z.string().regex(SOURCE_SHA_PATTERN),
  appcast_sha256: z.string().regex(SHA256_PATTERN),
  appcast_url: z.literal(DIRECT_APPCAST_URL),
  generated_at: z.string().regex(UTC_TIMESTAMP_PATTERN),
});

const zipReleaseManifestSchema = releaseManifestBaseSchema.extend({
  zip_url: z.url(),
  zip_sha256: z.string().regex(SHA256_PATTERN),
});

const legacyDmgReleaseManifestSchema = releaseManifestBaseSchema.extend({
  dmg_url: z.url(),
  dmg_sha256: z.string().regex(SHA256_PATTERN),
});

const releaseManifestSchema = z.union([
  zipReleaseManifestSchema,
  legacyDmgReleaseManifestSchema,
]);

type Fetcher = (
  input: string | URL,
  init?: RequestInit,
) => Promise<Response>;

type ValidatedDirectRelease = {
  archiveFileName: string;
  archiveUrl: URL;
  checksum: string;
  checksumUrl: URL;
};

function directDownloadBaseUrl(configuredBaseUrl?: string): URL {
  const baseUrl = new URL(configuredBaseUrl || DIRECT_DOWNLOAD_ORIGIN);
  if (
    baseUrl.origin !== DIRECT_DOWNLOAD_ORIGIN ||
    baseUrl.pathname !== "/" ||
    baseUrl.search ||
    baseUrl.hash ||
    baseUrl.username ||
    baseUrl.password
  ) {
    throw new Error("Direct download base URL is invalid");
  }
  return baseUrl;
}

export function validateDirectReleaseManifest(
  input: unknown,
): ValidatedDirectRelease {
  const manifest = releaseManifestSchema.parse(input);
  const isZipRelease = "zip_url" in manifest;
  const extension = isZipRelease ? "zip" : "dmg";
  const archiveUrl = new URL(isZipRelease ? manifest.zip_url : manifest.dmg_url);
  const archiveFileName =
    `hora-calendar-${manifest.marketing_version}-${manifest.build_number}.` +
    extension;
  const expectedPath =
    `/direct/stable/releases/${manifest.marketing_version}/` +
    `${manifest.build_number}/${archiveFileName}`;

  if (
    archiveUrl.origin !== DIRECT_DOWNLOAD_ORIGIN ||
    archiveUrl.pathname !== expectedPath ||
    archiveUrl.search ||
    archiveUrl.hash ||
    archiveUrl.username ||
    archiveUrl.password
  ) {
    throw new Error("Direct release URL is invalid");
  }

  return {
    archiveFileName,
    archiveUrl,
    checksum: isZipRelease ? manifest.zip_sha256 : manifest.dmg_sha256,
    checksumUrl: new URL(`${archiveUrl.href}.sha256`),
  };
}

async function fetchSmallText(
  fetcher: Fetcher,
  url: URL,
  accept: string,
  maxBytes: number,
): Promise<string> {
  const response = await fetcher(url, {
    cache: "no-store",
    headers: { Accept: accept },
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) throw new Error("Direct release metadata is unavailable");

  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new Error("Direct release metadata is too large");
  }

  const body = await response.text();
  if (new TextEncoder().encode(body).byteLength > maxBytes) {
    throw new Error("Direct release metadata is too large");
  }
  return body;
}

export async function resolveLatestDirectDownload(
  options: {
    baseUrl?: string;
    fetcher?: Fetcher;
  } = {},
): Promise<URL> {
  const fetcher = options.fetcher ?? fetch;
  const baseUrl = directDownloadBaseUrl(
    options.baseUrl ?? process.env.DIRECT_DOWNLOAD_BASE_URL,
  );
  const manifestUrl = new URL(DIRECT_LATEST_MANIFEST_PATH, baseUrl);
  const manifestText = await fetchSmallText(
    fetcher,
    manifestUrl,
    "application/json",
    MAX_MANIFEST_BYTES,
  );

  let manifest: unknown;
  try {
    manifest = JSON.parse(manifestText);
  } catch {
    throw new Error("Direct release manifest is invalid");
  }

  const release = validateDirectReleaseManifest(manifest);
  const checksumText = await fetchSmallText(
    fetcher,
    release.checksumUrl,
    "text/plain",
    MAX_CHECKSUM_BYTES,
  );
  const checksumMatch = checksumText.match(/^([0-9a-f]{64})  ([^\r\n]+)\r?\n?$/);
  if (
    !checksumMatch ||
    checksumMatch[1] !== release.checksum ||
    checksumMatch[2] !== release.archiveFileName
  ) {
    throw new Error("Direct release checksum is invalid");
  }

  return release.archiveUrl;
}
