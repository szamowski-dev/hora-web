import assert from "node:assert/strict";
import test from "node:test";
import { issueBody, supportBodySchema } from "../app/api/support/route";

const baseRequest = {
  name: "Test User",
  email: "test@example.com",
  category: "refund" as const,
  summary: "Refund request for Direct",
  details: "I would like to request a refund for this purchase.",
  paddleTransactionId: "txn_123",
};

test("requires an explicit refund outcome for every refund request", () => {
  const missing = supportBodySchema.safeParse(baseRequest);
  assert.equal(missing.success, false);

  for (const refundOutcome of ["refund_only", "refund_and_cancel"] as const) {
    const parsed = supportBodySchema.safeParse({
      ...baseRequest,
      refundOutcome,
    });
    assert.equal(parsed.success, true);
  }
});

test("rejects unknown outcomes and outcomes on non-refund categories", () => {
  assert.equal(
    supportBodySchema.safeParse({
      ...baseRequest,
      refundOutcome: "cancel_without_refund",
    }).success,
    false,
  );
  assert.equal(
    supportBodySchema.safeParse({
      ...baseRequest,
      category: "billing",
      refundOutcome: "refund_only",
    }).success,
    false,
  );
});

test("records the selected refund and renewal operation in the issue body", () => {
  const refundOnly = supportBodySchema.parse({
    ...baseRequest,
    refundOutcome: "refund_only",
  });
  const refundAndCancel = supportBodySchema.parse({
    ...baseRequest,
    refundOutcome: "refund_and_cancel",
  });

  assert.match(
    issueBody(refundOnly),
    /Requested refund outcome \| Refund only — keep automatic renewal unchanged/,
  );
  assert.match(
    issueBody(refundAndCancel),
    /Requested refund outcome \| Refund and cancel automatic renewal/,
  );
});
