import assert from "node:assert/strict";
import test from "node:test";
import {
  submitSupportRequest,
  SupportSubmissionError,
  supportRequestSchema,
} from "../lib/support-request";

const input = supportRequestSchema.parse({
  name: "Test User",
  email: "test@example.com",
  category: "bug",
  summary: "Calendar does not refresh",
  details: "The calendar stays stale after I change an event in Google Calendar.",
});

test("submits the validated request to the server PostHog ticket adapter", async () => {
  let request: { url: string; init?: RequestInit } | undefined;
  const result = await submitSupportRequest(input, async (url, init) => {
    request = { url: String(url), init };
    return new Response(JSON.stringify({ success: true, ticket_id: "ticket-123" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  });

  assert.deepEqual(result, { ticketId: "ticket-123" });
  assert.equal(request?.url, "/api/support");
  assert.equal(request?.init?.method, "POST");
  assert.deepEqual(JSON.parse(String(request?.init?.body)), input);
});

test("maps rate limits, invalid responses, and network failures", async () => {
  await assert.rejects(
    submitSupportRequest(input, async () => new Response("", { status: 429 })),
    (error: unknown) =>
      error instanceof SupportSubmissionError && error.failureType === "rate_limited",
  );

  await assert.rejects(
    submitSupportRequest(input, async () =>
      new Response(JSON.stringify({ success: true, ticket_id: "" }), { status: 201 }),
    ),
    (error: unknown) =>
      error instanceof SupportSubmissionError && error.failureType === "invalid_response",
  );

  await assert.rejects(
    submitSupportRequest(input, async () => {
      throw new Error("network failed");
    }),
    (error: unknown) =>
      error instanceof SupportSubmissionError && error.failureType === "network_or_server",
  );
});
