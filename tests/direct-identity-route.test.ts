import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import {
  type DirectIdentityDependencies,
  handleDirectIdentityRequest,
} from "../app/api/direct/identity/route";

const verifiedIdentity = {
  issuer: "https://accounts.google.com",
  subject: "shared-google-subject",
};
const appUserId =
  "usr_direct_v1_0123456789abcdefghijklmnopqrstuvwxyzABCDE";

function request(authorization?: string) {
  return new NextRequest("https://horacal.app/api/direct/identity", {
    method: "POST",
    headers: authorization ? { Authorization: authorization } : undefined,
  });
}

function dependencies(
  overrides: Partial<DirectIdentityDependencies> = {},
): DirectIdentityDependencies {
  return {
    verifyGoogleToken: async () => verifiedIdentity,
    resolveAppUserId: async () => appUserId,
    checkRequestLimit: () => true,
    ...overrides,
  };
}

test("returns only the canonical app_user_id for a verified token", async () => {
  let receivedToken: string | undefined;
  let receivedIdentity: [string, string] | undefined;
  const response = await handleDirectIdentityRequest(
    request("Bearer signed-google-id-token"),
    dependencies({
      verifyGoogleToken: async (token) => {
        receivedToken = token;
        return verifiedIdentity;
      },
      resolveAppUserId: async (issuer, subject) => {
        receivedIdentity = [issuer, subject];
        return appUserId;
      },
    }),
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(response.headers.get("vary"), "Authorization");
  assert.equal(receivedToken, "signed-google-id-token");
  assert.deepEqual(receivedIdentity, [
    "https://accounts.google.com",
    "shared-google-subject",
  ]);
  assert.deepEqual(await response.json(), { app_user_id: appUserId });
});

test("rejects missing, invalid, unconfigured and rate-limited proofs", async () => {
  const missing = await handleDirectIdentityRequest(request(), dependencies());
  assert.equal(missing.status, 401);

  const invalid = await handleDirectIdentityRequest(
    request("Bearer invalid-token"),
    dependencies({
      verifyGoogleToken: async () => {
        throw new Error("invalid signature");
      },
    }),
  );
  assert.equal(invalid.status, 401);

  const unavailable = await handleDirectIdentityRequest(
    request("Bearer valid-token"),
    dependencies({
      verifyGoogleToken: async () => {
        throw new Error("Google OpenID audiences are not configured");
      },
    }),
  );
  assert.equal(unavailable.status, 503);

  const limited = await handleDirectIdentityRequest(
    request("Bearer valid-token"),
    dependencies({ checkRequestLimit: () => false }),
  );
  assert.equal(limited.status, 429);
});

test("hides identity derivation failures and verified subject data", async () => {
  const response = await handleDirectIdentityRequest(
    request("Bearer valid-token"),
    dependencies({
      resolveAppUserId: async () => {
        throw new Error("DIRECT_IDENTITY_HMAC_KEY_V1 missing");
      },
    }),
  );
  const serializedBody = JSON.stringify(await response.json());

  assert.equal(response.status, 503);
  assert.deepEqual(JSON.parse(serializedBody), {
    error: "Direct identity is temporarily unavailable.",
  });
  assert.equal(serializedBody.includes(verifiedIdentity.subject), false);
  assert.equal(serializedBody.includes("valid-token"), false);
});
