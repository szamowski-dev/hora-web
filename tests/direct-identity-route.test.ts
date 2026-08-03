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
    getOrCreateAppUserId: async () =>
      "usr_0123456789abcdefghijklmnopqrstuvwxyz",
    checkRequestLimit: () => true,
    ...overrides,
  };
}

test("identity route accepts only a bearer token and returns app_user_id", async () => {
  let receivedToken: string | undefined;
  let receivedIdentity: [string, string] | undefined;
  const response = await handleDirectIdentityRequest(
    request("Bearer signed-google-id-token"),
    dependencies({
      verifyGoogleToken: async (token) => {
        receivedToken = token;
        return verifiedIdentity;
      },
      getOrCreateAppUserId: async (issuer, subject) => {
        receivedIdentity = [issuer, subject];
        return "usr_0123456789abcdefghijklmnopqrstuvwxyz";
      },
    }),
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(receivedToken, "signed-google-id-token");
  assert.deepEqual(receivedIdentity, [
    "https://accounts.google.com",
    "shared-google-subject",
  ]);
  assert.deepEqual(await response.json(), {
    app_user_id: "usr_0123456789abcdefghijklmnopqrstuvwxyz",
  });
});

test("the same verified Google identity resolves to one stable app_user_id", async () => {
  const mappings = new Map<string, string>();
  const deps = dependencies({
    getOrCreateAppUserId: async (issuer, subject) => {
      const key = `${issuer}\u0000${subject}`;
      const existing = mappings.get(key);
      if (existing) return existing;
      const appUserId = "usr_stable0123456789abcdefghijklmnopqrst";
      mappings.set(key, appUserId);
      return appUserId;
    },
  });

  const responses = await Promise.all(
    ["direct-token", "mas-token", "ios-token"].map((token) =>
      handleDirectIdentityRequest(request(`Bearer ${token}`), deps),
    ),
  );
  const bodies = await Promise.all(responses.map((response) => response.json()));

  assert.deepEqual(
    bodies.map((body) => body.app_user_id),
    Array(3).fill("usr_stable0123456789abcdefghijklmnopqrst"),
  );
  assert.equal(mappings.size, 1);
});

test("identity route rejects missing, invalid and rate-limited proofs", async () => {
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

test("identity route hides database failures", async () => {
  const response = await handleDirectIdentityRequest(
    request("Bearer valid-token"),
    dependencies({
      getOrCreateAppUserId: async () => {
        throw new Error("database details must stay private");
      },
    }),
  );

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    error: "Direct identity is temporarily unavailable.",
  });
});
