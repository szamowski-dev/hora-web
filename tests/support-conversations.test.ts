import assert from "node:assert/strict";
import test from "node:test";
import {
  submitSupportRequest,
  SupportSubmissionError,
  supportRequestSchema,
  type ConversationsClient,
} from "../lib/support-request";

const input = supportRequestSchema.parse({
  name: "Test User",
  email: "test@example.com",
  category: "bug",
  summary: "Calendar does not refresh",
  details: "The calendar stays stale after I change an event in Google Calendar.",
});

function client(overrides: Partial<ConversationsClient> = {}): ConversationsClient {
  return {
    isAvailable: () => true,
    getCurrentTicketId: () => null,
    getMessages: async () => null,
    sendMessage: async () => ({
      ticket_id: "ticket-new",
      message_id: "message-new",
      ticket_status: "new",
      created_at: "2026-08-20T00:00:00Z",
      unread_count: 0,
    }),
    ...overrides,
  };
}

test("creates a new ticket when there is no current ticket", async () => {
  const calls: unknown[][] = [];
  const result = await submitSupportRequest(
    client({
      sendMessage: async (...args) => {
        calls.push(args);
        return {
          ticket_id: "ticket-new",
          message_id: "message-new",
          ticket_status: "new",
          created_at: "2026-08-20T00:00:00Z",
          unread_count: 0,
        };
      },
    }),
    input,
  );

  assert.deepEqual(result, { ticketId: "ticket-new", appended: false });
  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.[2], true);
  assert.deepEqual(calls[0]?.[1], { name: "Test User", email: "test@example.com" });
  assert.doesNotMatch(String(calls[0]?.[0]), /Test User|test@example.com/);
});

test("appends to an active ticket without forcing a new ticket", async () => {
  const calls: unknown[][] = [];
  const result = await submitSupportRequest(
    client({
      getCurrentTicketId: () => "ticket-active",
      getMessages: async () => ({
        ticket_id: "ticket-active",
        ticket_status: "open",
        messages: [],
      }),
      sendMessage: async (...args) => {
        calls.push(args);
        return {
          ticket_id: "ticket-active",
          message_id: "message-follow-up",
          ticket_status: "open",
          created_at: "2026-08-20T00:00:00Z",
          unread_count: 0,
        };
      },
    }),
    input,
  );

  assert.deepEqual(result, { ticketId: "ticket-active", appended: true });
  assert.equal(calls[0]?.length, 2);
});

test("creates a new ticket after a resolved ticket", async () => {
  const calls: unknown[][] = [];
  await submitSupportRequest(
    client({
      getCurrentTicketId: () => "ticket-resolved",
      getMessages: async () => ({
        ticket_id: "ticket-resolved",
        ticket_status: "resolved",
        messages: [],
      }),
      sendMessage: async (...args) => {
        calls.push(args);
        return {
          ticket_id: "ticket-next",
          message_id: "message-next",
          ticket_status: "new",
          created_at: "2026-08-20T00:00:00Z",
          unread_count: 0,
        };
      },
    }),
    input,
  );
  assert.equal(calls[0]?.[2], true);
});

test("maps availability timeout, null response, 429, lookup and invalid response", async () => {
  await assert.rejects(
    submitSupportRequest(client({ isAvailable: () => false }), input, {
      availabilityTimeoutMs: 0,
      availabilityIntervalMs: 0,
    }),
    (error: unknown) => error instanceof SupportSubmissionError && error.failureType === "conversations_unavailable",
  );

  await assert.rejects(
    submitSupportRequest(client({ sendMessage: async () => null }), input),
    (error: unknown) => error instanceof SupportSubmissionError && error.failureType === "conversations_unavailable",
  );

  await assert.rejects(
    submitSupportRequest(
      client({ sendMessage: async () => { throw new Error("429 Too Many Requests"); } }),
      input,
    ),
    (error: unknown) => error instanceof SupportSubmissionError && error.failureType === "rate_limited",
  );

  await assert.rejects(
    submitSupportRequest(
      client({
        getCurrentTicketId: () => "ticket-current",
        getMessages: async () => { throw new Error("network failed"); },
      }),
      input,
    ),
    (error: unknown) => error instanceof SupportSubmissionError && error.failureType === "ticket_lookup_failed",
  );

  await assert.rejects(
    submitSupportRequest(
      client({
        getCurrentTicketId: () => "ticket-current",
        getMessages: async () => null,
      }),
      input,
    ),
    (error: unknown) => error instanceof SupportSubmissionError && error.failureType === "ticket_lookup_failed",
  );

  await assert.rejects(
    submitSupportRequest(
      client({ sendMessage: async () => ({ ticket_id: "", message_id: "m", ticket_status: "new", created_at: "", unread_count: 0 }) }),
      input,
    ),
    (error: unknown) => error instanceof SupportSubmissionError && error.failureType === "invalid_response",
  );
});
