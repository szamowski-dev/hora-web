import assert from "node:assert/strict";
import test from "node:test";
import { generateKeyPair, SignJWT } from "jose";
import {
  bearerTokenFromAuthorization,
  googleOAuthAudiences,
  identityFromVerifiedGooglePayload,
  verifyGoogleIdToken,
} from "../lib/direct/google-openid";

const nowSeconds = 2_000_000_000;
const directAudience = "direct.apps.googleusercontent.com";
const masAudience = "mas.apps.googleusercontent.com";
const iosAudience = "ios.apps.googleusercontent.com";
const acceptedAudiences = [directAudience, masAudience, iosAudience];

async function signedGoogleToken(options: {
  audience?: string;
  expiresAt?: number;
  issuer?: string;
  subject?: string;
}) {
  const { privateKey, publicKey } = await generateKeyPair("RS256");
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(options.issuer ?? "https://accounts.google.com")
    .setSubject(options.subject ?? "shared-google-subject")
    .setAudience(options.audience ?? directAudience)
    .setIssuedAt(nowSeconds)
    .setExpirationTime(options.expiresAt ?? nowSeconds + 300)
    .sign(privateKey);
  return { publicKey, token };
}

test("builds a deduplicated allowlist from native client IDs", () => {
  assert.deepEqual(
    googleOAuthAudiences({
      GOOGLE_OAUTH_NATIVE_CLIENT_IDS:
        "mac.apps.googleusercontent.com, mac.apps.googleusercontent.com, ios.apps.googleusercontent.com",
    }),
    [
      "mac.apps.googleusercontent.com",
      "ios.apps.googleusercontent.com",
    ],
  );
});

test("supports a native-only identity endpoint configuration", () => {
  assert.deepEqual(
    googleOAuthAudiences({
      GOOGLE_OAUTH_NATIVE_CLIENT_IDS: "mac.apps.googleusercontent.com",
    }),
    ["mac.apps.googleusercontent.com"],
  );
});

test("rejects an empty audience configuration", () => {
  assert.throws(() =>
    googleOAuthAudiences({
      GOOGLE_OAUTH_NATIVE_CLIENT_IDS: " , ",
    }),
  );
});

test("canonicalizes both documented Google issuer spellings", () => {
  for (const issuer of ["accounts.google.com", "https://accounts.google.com"]) {
    assert.deepEqual(
      identityFromVerifiedGooglePayload({ iss: issuer, sub: "google-user-123" }),
      {
        issuer: "https://accounts.google.com",
        subject: "google-user-123",
      },
    );
  }
});

test("rejects missing subjects and foreign issuers", () => {
  assert.throws(() =>
    identityFromVerifiedGooglePayload({
      iss: "https://accounts.google.com",
    }),
  );
  assert.throws(() =>
    identityFromVerifiedGooglePayload({
      iss: "https://example.com",
      sub: "google-user-123",
    }),
  );
});

test("extracts only a non-empty Bearer token", () => {
  assert.equal(bearerTokenFromAuthorization("Bearer signed-token"), "signed-token");
  assert.equal(bearerTokenFromAuthorization("Bearer    "), null);
  assert.equal(bearerTokenFromAuthorization("Basic signed-token"), null);
  assert.equal(bearerTokenFromAuthorization(null), null);
});

test("verifies signed tokens for every configured native audience", async () => {
  const identities = [];

  for (const audience of acceptedAudiences) {
    const { publicKey, token } = await signedGoogleToken({ audience });
    identities.push(
      await verifyGoogleIdToken(token, {
        audiences: acceptedAudiences,
        currentDate: new Date(nowSeconds * 1_000),
        key: publicKey,
      }),
    );
  }

  assert.deepEqual(identities, [
    { issuer: "https://accounts.google.com", subject: "shared-google-subject" },
    { issuer: "https://accounts.google.com", subject: "shared-google-subject" },
    { issuer: "https://accounts.google.com", subject: "shared-google-subject" },
  ]);
});

test("rejects a signed token with the wrong audience", async () => {
  const { publicKey, token } = await signedGoogleToken({
    audience: "foreign.apps.googleusercontent.com",
  });

  await assert.rejects(() =>
    verifyGoogleIdToken(token, {
      audiences: acceptedAudiences,
      currentDate: new Date(nowSeconds * 1_000),
      key: publicKey,
    }),
  );
});

test("rejects foreign issuers, expired tokens and damaged signatures", async () => {
  const foreignIssuer = await signedGoogleToken({
    issuer: "https://example.com",
  });
  const expired = await signedGoogleToken({ expiresAt: nowSeconds - 1 });
  const valid = await signedGoogleToken({});
  const parts = valid.token.split(".");
  const firstSignatureCharacter = parts[2][0];
  parts[2] = `${firstSignatureCharacter === "a" ? "b" : "a"}${parts[2].slice(1)}`;
  const damagedSignature = parts.join(".");
  const verificationOptions = {
    audiences: acceptedAudiences,
    currentDate: new Date(nowSeconds * 1_000),
  };

  await assert.rejects(() =>
    verifyGoogleIdToken(foreignIssuer.token, {
      ...verificationOptions,
      key: foreignIssuer.publicKey,
    }),
  );
  await assert.rejects(() =>
    verifyGoogleIdToken(expired.token, {
      ...verificationOptions,
      key: expired.publicKey,
    }),
  );
  await assert.rejects(() =>
    verifyGoogleIdToken(damagedSignature, {
      ...verificationOptions,
      key: valid.publicKey,
    }),
  );
  await assert.rejects(() =>
    verifyGoogleIdToken("not-a-jwt", {
      ...verificationOptions,
      key: valid.publicKey,
    }),
  );
});
