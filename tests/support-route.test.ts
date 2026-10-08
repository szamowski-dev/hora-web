import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { POST } from "../app/api/support/route";

const requestBody = {
  name: "Test User",
  email: "test@example.com",
  category: "bug",
  summary: "Calendar does not refresh",
  details: "The calendar stays stale after I change an event in Google Calendar.",
};

const intakeEnv = {
  RESEND_API_KEY: "re_test",
  LINEAR_INTAKE_BUGS: "bugs@intake.linear.test",
  LINEAR_INTAKE_FEATURES: "features@intake.linear.test",
  LINEAR_INTAKE_BILLING: "billing@intake.linear.test",
  LINEAR_INTAKE_QUESTIONS: "questions@intake.linear.test",
};

function postSupport(body: object, ip: string) {
  return POST(
    new NextRequest("https://horacal.app/api/support", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://horacal.app",
        "X-Forwarded-For": ip,
      },
      body: JSON.stringify(body),
    }),
  );
}

async function withEnv(env: Record<string, string | undefined>, run: () => Promise<void>) {
  const original = Object.fromEntries(Object.keys(env).map((key) => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;
  for (const [key, value] of Object.entries(env)) setEnv(key, value);
  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(original)) setEnv(key, value);
  }
}

test("sends the request to the category's Linear intake with the customer as Reply-To", async () => {
  await withEnv(intakeEnv, async () => {
    const requests: Array<{ url: string; body: Record<string, unknown> }> = [];
    globalThis.fetch = async (url, init) => {
      requests.push({ url: String(url), body: JSON.parse(String(init?.body)) });
      return new Response(JSON.stringify({ id: "email-123" }), { status: 200 });
    };

    const response = await postSupport(requestBody, "203.0.113.1");

    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { success: true, ticket_id: "email-123" });
    assert.equal(requests.length, 1);
    assert.equal(requests[0]?.url, "https://api.resend.com/emails");
    assert.equal(requests[0]?.body.from, "hora Support <support@horacal.app>");
    assert.equal(requests[0]?.body.to, "bugs@intake.linear.test");
    assert.equal(requests[0]?.body.reply_to, "test@example.com");
    assert.equal(requests[0]?.body.subject, "[Bug report] Calendar does not refresh");
    assert.equal(
      requests[0]?.body.text,
      "[Bug report] Calendar does not refresh\n\nDetails\nThe calendar stays stale after I change an event in Google Calendar.\n\nRequester\n- Test User <test@example.com>",
    );
  });
});

test("routes feature requests to the features intake", async () => {
  await withEnv(intakeEnv, async () => {
    let to: unknown;
    globalThis.fetch = async (_url, init) => {
      to = JSON.parse(String(init?.body)).to;
      return new Response(JSON.stringify({ id: "email-456" }), { status: 200 });
    };

    const response = await postSupport({ ...requestBody, category: "feature" }, "203.0.113.2");

    assert.equal(response.status, 201);
    assert.equal(to, "features@intake.linear.test");
  });
});

test("returns 503 without sending when the intake is not configured", async () => {
  await withEnv({ ...intakeEnv, LINEAR_INTAKE_BUGS: undefined }, async () => {
    let called = false;
    globalThis.fetch = async () => {
      called = true;
      return new Response(null, { status: 500 });
    };

    const response = await postSupport(requestBody, "203.0.113.3");

    assert.equal(response.status, 503);
    assert.equal((await response.json()).failure_type, "conversations_unavailable");
    assert.equal(called, false);
  });
});

function setEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}
