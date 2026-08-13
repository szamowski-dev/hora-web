import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import {
  type DirectPushDeviceDependencies,
  handleDirectPushDeviceRequest,
} from "../app/api/direct/push/device/route";

const verifiedIdentity = {
  issuer: "https://accounts.google.com",
  subject: "push-google-subject",
};
const appUserId =
  "usr_direct_v1_0123456789abcdefghijklmnopqrstuvwxyzABCDE";
const token = "A1".repeat(32);

function request(
  body: unknown,
  authorization: string | null = "Bearer signed-google-id-token",
) {
  return new NextRequest("https://horacal.app/api/direct/push/device", {
    method: "POST",
    headers: {
      ...(authorization ? { Authorization: authorization } : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function dependencies(
  overrides: Partial<DirectPushDeviceDependencies> = {},
): DirectPushDeviceDependencies {
  return {
    verifyGoogleToken: async () => verifiedIdentity,
    resolveAppUserId: async () => appUserId,
    checkRequestLimit: () => true,
    sendDeviceCommand: async () => {},
    ...overrides,
  };
}

test("derives the canonical ID server-side and forwards a normalized registration", async () => {
  let receivedIdentity: [string, string] | undefined;
  let receivedCommand: unknown;
  const response = await handleDirectPushDeviceRequest(
    request({
      action: "register",
      apns_token: token,
      apns_environment: "production",
    }),
    dependencies({
      resolveAppUserId: async (issuer, subject) => {
        receivedIdentity = [issuer, subject];
        return appUserId;
      },
      sendDeviceCommand: async (command) => {
        receivedCommand = command;
      },
    }),
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(response.headers.get("vary"), "Authorization");
  assert.deepEqual(await response.json(), { ok: true });
  assert.deepEqual(receivedIdentity, [
    "https://accounts.google.com",
    "push-google-subject",
  ]);
  assert.deepEqual(receivedCommand, {
    action: "register",
    app_user_id: appUserId,
    apns_token: token.toLowerCase(),
    apns_environment: "production",
  });
});

test("forwards unregister using the same authenticated identity contract", async () => {
  let receivedCommand: unknown;
  const response = await handleDirectPushDeviceRequest(
    request({
      action: "unregister",
      apns_token: token,
      apns_environment: "sandbox",
    }),
    dependencies({
      sendDeviceCommand: async (command) => {
        receivedCommand = command;
      },
    }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(receivedCommand, {
    action: "unregister",
    app_user_id: appUserId,
    apns_token: token.toLowerCase(),
    apns_environment: "sandbox",
  });
});

test("never accepts app_user_id or malformed device data from the client", async () => {
  const cases = [
    {
      action: "register",
      app_user_id: "usr_direct_v1_attacker_selected",
      apns_token: token,
      apns_environment: "production",
    },
    {
      action: "register",
      apns_token: "a".repeat(31),
      apns_environment: "production",
    },
    {
      action: "register",
      apns_token: "a".repeat(33),
      apns_environment: "production",
    },
    {
      action: "register",
      apns_token: "a".repeat(202),
      apns_environment: "production",
    },
    {
      action: "register",
      apns_token: token,
      apns_environment: "development",
    },
  ];

  for (const body of cases) {
    const response = await handleDirectPushDeviceRequest(
      request(body),
      dependencies(),
    );
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      code: "invalid_request",
      retryable: false,
    });
  }
});

test("accepts bounded opaque APNs token lengths without assuming 32 bytes", async () => {
  for (const apnsToken of ["ab".repeat(16), "cd".repeat(100)]) {
    let receivedToken: string | undefined;
    const response = await handleDirectPushDeviceRequest(
      request({
        action: "register",
        apns_token: apnsToken,
        apns_environment: "production",
      }),
      dependencies({
        sendDeviceCommand: async (command) => {
          receivedToken = command.apns_token;
        },
      }),
    );
    assert.equal(response.status, 200);
    assert.equal(receivedToken, apnsToken);
  }
});

test("rejects an oversized request body before parsing it", async () => {
  let verified = false;
  const oversized = new NextRequest(
    "https://horacal.app/api/direct/push/device",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer signed-google-id-token",
        "Content-Length": "2049",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "register" }),
    },
  );
  const response = await handleDirectPushDeviceRequest(
    oversized,
    dependencies({
      verifyGoogleToken: async () => {
        verified = true;
        return verifiedIdentity;
      },
    }),
  );

  assert.equal(response.status, 400);
  assert.equal(verified, false);
  assert.deepEqual(await response.json(), {
    code: "invalid_request",
    retryable: false,
  });
});

test("enforces the body limit even when Content-Length is absent", async () => {
  const oversized = new NextRequest(
    "https://horacal.app/api/direct/push/device",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer signed-google-id-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ padding: "x".repeat(2_049) }),
    },
  );
  const response = await handleDirectPushDeviceRequest(
    oversized,
    dependencies(),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    code: "invalid_request",
    retryable: false,
  });
});

test("returns stable authentication, rate limit, identity and worker failures", async () => {
  const missing = await handleDirectPushDeviceRequest(
    request({}, null),
    dependencies(),
  );
  assert.equal(missing.status, 401);
  assert.deepEqual(await missing.json(), {
    code: "invalid_sign_in_proof",
    retryable: false,
  });

  const limited = await handleDirectPushDeviceRequest(
    request({
      action: "register",
      apns_token: token,
      apns_environment: "production",
    }),
    dependencies({ checkRequestLimit: () => false }),
  );
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after"), "600");

  const identityUnavailable = await handleDirectPushDeviceRequest(
    request({
      action: "register",
      apns_token: token,
      apns_environment: "production",
    }),
    dependencies({
      resolveAppUserId: async () => {
        throw new Error("missing identity HMAC key");
      },
    }),
  );
  assert.equal(identityUnavailable.status, 503);
  assert.deepEqual(await identityUnavailable.json(), {
    code: "identity_unavailable",
    retryable: true,
    retry_after_seconds: 30,
  });

  const workerUnavailable = await handleDirectPushDeviceRequest(
    request({
      action: "register",
      apns_token: token,
      apns_environment: "production",
    }),
    dependencies({
      sendDeviceCommand: async () => {
        throw new Error("worker unavailable");
      },
    }),
  );
  assert.equal(workerUnavailable.status, 503);
  assert.deepEqual(await workerUnavailable.json(), {
    code: "push_registration_unavailable",
    retryable: true,
    retry_after_seconds: 30,
  });
});
