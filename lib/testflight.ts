import "server-only";
import { createSign } from "node:crypto";

const API_BASE_URL = "https://api.appstoreconnect.apple.com/v1";
const COUNT_TTL_MS = 60 * 60 * 1000;
const FAILURE_COOLDOWN_MS = 60 * 1000;
const JWT_TTL_SECONDS = 19 * 60;

let countCache: { value: number; expires: number } | null = null;
let jwtCache: { value: string; expires: number } | null = null;
let lastKnown: number | null = null;
let lastFailureAt = 0;
let inflight: Promise<number | null> | null = null;

function base64Url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function normalizePrivateKey(value: string) {
  return value
    .trim()
    .replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n");
}

function createAppStoreConnectJwt() {
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (jwtCache && jwtCache.expires > nowSeconds + 30) return jwtCache.value;

  const keyId = getRequiredEnv("ASC_KEY_ID");
  const issuerId = getRequiredEnv("ASC_ISSUER_ID");
  const privateKey = normalizePrivateKey(getRequiredEnv("ASC_PRIVATE_KEY"));

  const header = {
    alg: "ES256",
    kid: keyId,
    typ: "JWT",
  };
  const payload = {
    aud: "appstoreconnect-v1",
    exp: nowSeconds + JWT_TTL_SECONDS,
    iat: nowSeconds,
    iss: issuerId,
  };

  const unsignedToken = `${base64Url(JSON.stringify(header))}.${base64Url(
    JSON.stringify(payload),
  )}`;
  const signature = createSign("SHA256")
    .update(unsignedToken)
    .end()
    .sign({ key: privateKey, dsaEncoding: "ieee-p1363" });
  const token = `${unsignedToken}.${base64Url(signature)}`;

  jwtCache = {
    value: token,
    expires: payload.exp,
  };

  return token;
}

type TestFlightCountResponse = {
  meta?: {
    paging?: {
      total?: number;
    };
  };
};

export async function fetchTestFlightTesterCount() {
  const appId = getRequiredEnv("ASC_APP_ID");
  const token = createAppStoreConnectJwt();
  const url = new URL(`${API_BASE_URL}/betaTesters`);
  url.searchParams.set("filter[apps]", appId);
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: COUNT_TTL_MS / 1000 },
  });

  if (!response.ok) {
    console.error("[testflight] App Store Connect count failed:", {
      status: response.status,
      statusText: response.statusText,
    });
    return null;
  }

  const json = (await response.json()) as TestFlightCountResponse;
  const count = json.meta?.paging?.total;
  return typeof count === "number" ? count : null;
}

export async function getTestFlightTesterCount(
  fallback: number,
): Promise<number> {
  const now = Date.now();
  if (countCache && countCache.expires > now) return countCache.value;
  if (now - lastFailureAt < FAILURE_COOLDOWN_MS) {
    return lastKnown ?? fallback;
  }

  if (!inflight) {
    inflight = (async () => {
      try {
        const count = await fetchTestFlightTesterCount();
        if (count === null) {
          lastFailureAt = Date.now();
        } else {
          countCache = { value: count, expires: Date.now() + COUNT_TTL_MS };
          lastKnown = count;
        }
        return count;
      } catch (err) {
        console.error("[testflight] Unexpected count error:", err);
        lastFailureAt = Date.now();
        return null;
      } finally {
        inflight = null;
      }
    })();
  }

  const count = await inflight;
  return count ?? lastKnown ?? fallback;
}
