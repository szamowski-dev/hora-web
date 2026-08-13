import assert from "node:assert/strict";
import test from "node:test";
import { sendDirectPushDeviceCommand } from "../lib/direct/push-worker";

const command = {
  action: "register" as const,
  app_user_id: `usr_direct_v1_${"a".repeat(43)}`,
  apns_token: "ab".repeat(32),
  apns_environment: "production" as const,
};

test("sends the private worker command with the dedicated bearer secret", async () => {
  let receivedUrl: string | undefined;
  let receivedInit: RequestInit | undefined;
  await sendDirectPushDeviceCommand(
    command,
    {
      DIRECT_PUSH_WORKER_URL: "https://push.horacal.app/internal/",
      DIRECT_PUSH_WORKER_SECRET: "dedicated-secret",
    },
    {
      fetch: async (input, init) => {
        receivedUrl = input.toString();
        receivedInit = init;
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      },
    },
  );

  assert.equal(
    receivedUrl,
    "https://push.horacal.app/internal/v1/direct/devices",
  );
  assert.equal(
    new Headers(receivedInit?.headers).get("authorization"),
    "Bearer dedicated-secret",
  );
  assert.deepEqual(JSON.parse(String(receivedInit?.body)), command);
});

test("fails closed for missing configuration, insecure URLs and worker errors", async () => {
  await assert.rejects(() =>
    sendDirectPushDeviceCommand(command, {}, { fetch }),
  );
  await assert.rejects(() =>
    sendDirectPushDeviceCommand(
      command,
      {
        DIRECT_PUSH_WORKER_URL: "http://push.horacal.app",
        DIRECT_PUSH_WORKER_SECRET: "secret",
      },
      { fetch },
    ),
  );
  await assert.rejects(() =>
    sendDirectPushDeviceCommand(
      command,
      {
        DIRECT_PUSH_WORKER_URL: "https://push.horacal.app",
        DIRECT_PUSH_WORKER_SECRET: "secret",
      },
      {
        fetch: async () => new Response(null, { status: 503 }),
      },
    ),
  );
});
