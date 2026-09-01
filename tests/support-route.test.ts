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

test("creates an email ticket before applying support metadata", async () => {
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const originalProjectId = process.env.POSTHOG_PROJECT_ID;
  const originalEmailConfigId = process.env.POSTHOG_SUPPORT_EMAIL_CONFIG_ID;
  const requests: Array<{ url: string; init?: RequestInit }> = [];

  process.env.POSTHOG_PERSONAL_API_KEY = "test-personal-key";
  process.env.POSTHOG_PROJECT_ID = "test-project";
  process.env.POSTHOG_SUPPORT_EMAIL_CONFIG_ID = "test-email-config";
  globalThis.fetch = async (url, init) => {
    requests.push({ url: String(url), init });
    return requests.length === 1
      ? new Response(JSON.stringify({ id: "ticket-123" }), { status: 201 })
      : new Response(null, { status: 200 });
  };

  try {
    const response = await POST(
      new NextRequest("https://horacal.app/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://horacal.app",
          "X-Forwarded-For": "203.0.113.1",
        },
        body: JSON.stringify(requestBody),
      }),
    );

    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { success: true, ticket_id: "ticket-123" });
    assert.equal(requests.length, 2);
    assert.equal(
      requests[0]?.url,
      "https://us.posthog.com/api/projects/test-project/conversations/tickets/compose/",
    );
    assert.deepEqual(JSON.parse(String(requests[0]?.init?.body)), {
      recipient_email: "test@example.com",
      email_subject: "[Bug report] Calendar does not refresh",
      email_config_id: "test-email-config",
      message:
        "[Bug report] Calendar does not refresh\n\nDetails\nThe calendar stays stale after I change an event in Google Calendar.",
    });
    assert.equal(
      requests[1]?.url,
      "https://us.posthog.com/api/projects/test-project/conversations/tickets/ticket-123/",
    );
    assert.deepEqual(JSON.parse(String(requests[1]?.init?.body)), {
      priority: "high",
      tags: ["bug"],
    });
  } finally {
    globalThis.fetch = originalFetch;
    restoreEnv("POSTHOG_PERSONAL_API_KEY", originalApiKey);
    restoreEnv("POSTHOG_PROJECT_ID", originalProjectId);
    restoreEnv("POSTHOG_SUPPORT_EMAIL_CONFIG_ID", originalEmailConfigId);
  }
});

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}
