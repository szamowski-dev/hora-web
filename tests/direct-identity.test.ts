import assert from "node:assert/strict";
import test from "node:test";
import {
  DIRECT_APP_USER_ID_PREFIX,
  directAppUserIdForGoogleIdentity,
} from "../lib/direct/identity";

const issuer = "https://accounts.google.com";
const firstKey = "00".repeat(32);
const secondKey = "11".repeat(32);

function environment(key = firstKey) {
  return { DIRECT_IDENTITY_HMAC_KEY_V1: key };
}

test("derives a stable RevenueCat-safe canonical ID", () => {
  const first = directAppUserIdForGoogleIdentity(
    issuer,
    "google-subject",
    environment(),
  );
  const second = directAppUserIdForGoogleIdentity(
    issuer,
    "google-subject",
    environment(),
  );

  assert.equal(first, second);
  assert.equal(
    first,
    "usr_direct_v1_5HLSPFoMFPKexol-_lXHFeFKbIpcZ_soHvuURKhaHis",
  );
  assert.match(first, /^usr_direct_v1_[A-Za-z0-9_-]{43}$/);
  assert.ok(first.length <= 100);
});

test("separates identities and HMAC key versions", () => {
  const baseline = directAppUserIdForGoogleIdentity(
    issuer,
    "google-subject",
    environment(),
  );
  assert.notEqual(
    baseline,
    directAppUserIdForGoogleIdentity(issuer, "another-subject", environment()),
  );
  assert.notEqual(
    baseline,
    directAppUserIdForGoogleIdentity(
      issuer,
      "google-subject",
      environment(secondKey),
    ),
  );
});

test("rejects missing, weak and malformed HMAC keys", () => {
  for (const key of [undefined, "", "00", "z".repeat(64)]) {
    assert.throws(() =>
      directAppUserIdForGoogleIdentity(issuer, "google-subject", {
        DIRECT_IDENTITY_HMAC_KEY_V1: key,
      }),
    );
  }
});

test("rejects identities that were not canonicalized by the verifier", () => {
  assert.throws(() =>
    directAppUserIdForGoogleIdentity(
      "accounts.google.com",
      "google-subject",
      environment(),
    ),
  );
  assert.throws(() =>
    directAppUserIdForGoogleIdentity(issuer, "", environment()),
  );
  assert.throws(() =>
    directAppUserIdForGoogleIdentity(
      issuer,
      "x".repeat(256),
      environment(),
    ),
  );
});

test("keeps the versioned prefix explicit", () => {
  assert.equal(DIRECT_APP_USER_ID_PREFIX, "usr_direct_v1_");
});
