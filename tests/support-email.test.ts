import assert from "node:assert/strict";
import test from "node:test";
import {
  submitSupportTicketMetadata,
  SupportSubmissionError,
} from "../lib/support-request";

const ticketId = "be5c35a8-107a-4cd7-8a85-5885cb9b2305";

test("submits only ticket metadata to the server PostHog ticket adapter", async () => {
  let request: { url: string; init?: RequestInit } | undefined;
  await submitSupportTicketMetadata(ticketId, "bug", async (url, init) => {
    request = { url: String(url), init };
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });

  assert.equal(request?.url, "/api/support");
  assert.equal(request?.init?.method, "POST");
  assert.deepEqual(JSON.parse(String(request?.init?.body)), {
    ticket_id: ticketId,
    category: "bug",
  });
});

test("maps rate limits, invalid responses, and network failures", async () => {
  await assert.rejects(
    submitSupportTicketMetadata(ticketId, "bug", async () => new Response("", { status: 429 })),
    (error: unknown) =>
      error instanceof SupportSubmissionError && error.failureType === "rate_limited",
  );

  await assert.rejects(
    submitSupportTicketMetadata(ticketId, "bug", async () =>
      new Response(JSON.stringify({ success: false }), { status: 200 }),
    ),
    (error: unknown) =>
      error instanceof SupportSubmissionError && error.failureType === "invalid_response",
  );

  await assert.rejects(
    submitSupportTicketMetadata(ticketId, "bug", async () => {
      throw new Error("network failed");
    }),
    (error: unknown) =>
      error instanceof SupportSubmissionError && error.failureType === "network_or_server",
  );
});
