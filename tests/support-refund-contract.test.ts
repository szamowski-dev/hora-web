import assert from "node:assert/strict";
import test from "node:test";
import {
  formatSupportMessage,
  refundOutcomeLabels,
  supportFailedEventProperties,
  supportSubmittedEventProperties,
  supportTicketMetadata,
  supportRequestSchema,
} from "../lib/support-request";

const baseRequest = {
  name: "Test User",
  email: "test@example.com",
  category: "refund" as const,
  summary: "Refund request for Direct",
  details: "I would like to request a refund for this purchase.",
  paddleTransactionId: "txn_123",
};

test("requires an explicit refund outcome for every refund request", () => {
  const missing = supportRequestSchema.safeParse(baseRequest);
  assert.equal(missing.success, false);

  for (const refundOutcome of ["refund_only", "refund_and_cancel"] as const) {
    const parsed = supportRequestSchema.safeParse({
      ...baseRequest,
      refundOutcome,
    });
    assert.equal(parsed.success, true);
  }
});

test("rejects unknown outcomes and outcomes on non-refund categories", () => {
  assert.equal(
    supportRequestSchema.safeParse({
      ...baseRequest,
      refundOutcome: "cancel_without_refund",
    }).success,
    false,
  );
  assert.equal(
    supportRequestSchema.safeParse({
      ...baseRequest,
      category: "billing",
      refundOutcome: "refund_only",
    }).success,
    false,
  );
});

test("records the selected refund and renewal operation in the support message", () => {
  const refundOnly = supportRequestSchema.parse({
    ...baseRequest,
    refundOutcome: "refund_only",
  });
  const refundAndCancel = supportRequestSchema.parse({
    ...baseRequest,
    refundOutcome: "refund_and_cancel",
  });

  assert.match(
    formatSupportMessage(refundOnly),
    new RegExp(refundOutcomeLabels.refund_only),
  );
  assert.match(
    formatSupportMessage(refundAndCancel),
    new RegExp(refundOutcomeLabels.refund_and_cancel),
  );
});

test("rejects a filled honeypot", () => {
  assert.equal(
    supportRequestSchema.safeParse({
      ...baseRequest,
      refundOutcome: "refund_only",
      honey: "spam",
    }).success,
    false,
  );
});

test("formats every category and omits empty optional sections", () => {
  for (const category of ["bug", "sync", "account", "billing", "refund", "feature", "other"] as const) {
    const input = supportRequestSchema.parse({
      ...baseRequest,
      category,
      refundOutcome: category === "refund" ? "refund_only" : undefined,
      appVersion: "",
      osVersion: "",
      steps: "",
      paddleTransactionId: category === "refund" ? "txn_123" : undefined,
    });
    const message = formatSupportMessage(input);
    assert.match(message, new RegExp(`^\\[.*\\] ${input.summary}`));
    assert.match(message, /Details/);
    assert.doesNotMatch(message, /Environment/);
    if (category === "refund") assert.match(message, /\nRefund request\n/);
    else assert.doesNotMatch(message, /\nRefund request\n/);
    assert.doesNotMatch(message, /Test User|test@example.com/);
  }
});

test("maps each support category to a PostHog tag and priority", () => {
  assert.deepEqual(supportTicketMetadata, {
    bug: { priority: "high", tags: ["bug"] },
    account: { priority: "medium", tags: ["account"] },
    sync: { priority: "high", tags: ["sync"] },
    billing: { priority: "high", tags: ["billing"] },
    refund: { priority: "high", tags: ["refund"] },
    feature: { priority: "low", tags: ["feature"] },
    other: { priority: "medium", tags: ["other"] },
  });
});

test("support analytics properties contain no PII or ticket identifiers", () => {
  const submitted = supportSubmittedEventProperties("refund");
  const failed = supportFailedEventProperties("refund", "network_or_server");
  assert.deepEqual(submitted, { category: "refund" });
  assert.deepEqual(failed, {
    category: "refund",
    failure_type: "network_or_server",
  });
  assert.equal("name" in submitted, false);
  assert.equal("email" in submitted, false);
  assert.equal("ticket_id" in submitted, false);
  assert.equal("name" in failed, false);
  assert.equal("email" in failed, false);
  assert.equal("ticket_id" in failed, false);
});
