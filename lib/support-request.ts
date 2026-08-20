import { z } from "zod";

export const refundOutcomes = ["refund_only", "refund_and_cancel"] as const;
export type RefundOutcome = (typeof refundOutcomes)[number];

export const supportCategories = [
  "bug",
  "account",
  "sync",
  "billing",
  "refund",
  "feature",
  "other",
] as const;

export type SupportCategory = (typeof supportCategories)[number];

export const categoryLabels: Record<SupportCategory, string> = {
  bug: "Bug report",
  account: "Account or login",
  sync: "Calendar sync",
  billing: "Billing",
  refund: "Paddle refund (direct purchase)",
  feature: "Feature request",
  other: "Other",
};

export const refundOutcomeLabels: Record<RefundOutcome, string> = {
  refund_only: "Refund only — keep automatic renewal unchanged",
  refund_and_cancel: "Refund and cancel automatic renewal",
};

export const supportRequestSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(254),
    category: z.enum(supportCategories),
    summary: z.string().trim().min(8).max(120),
    details: z.string().trim().min(20).max(4000),
    appVersion: z.string().trim().max(40).optional(),
    osVersion: z.string().trim().max(80).optional(),
    steps: z.string().trim().max(2000).optional(),
    paddleTransactionId: z.string().trim().max(100).optional(),
    refundOutcome: z.enum(refundOutcomes).optional(),
    honey: z.string().max(0).optional(),
  })
  .superRefine((input, context) => {
    if (input.category === "refund" && !input.refundOutcome) {
      context.addIssue({
        code: "custom",
        path: ["refundOutcome"],
        message: "Choose whether the refund should also cancel renewal.",
      });
    }
    if (input.category !== "refund" && input.refundOutcome) {
      context.addIssue({
        code: "custom",
        path: ["refundOutcome"],
        message: "Refund outcome is only valid for refund requests.",
      });
    }
  });

export type SupportRequest = z.infer<typeof supportRequestSchema>;

function nonEmpty(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function formatSupportMessage(input: SupportRequest): string {
  const lines = [`[${categoryLabels[input.category]}] ${input.summary.trim()}`];
  const details = nonEmpty(input.details);
  const environment = [
    ["App version", input.appVersion],
    ["OS version", input.osVersion],
  ].flatMap(([label, value]) => {
    const trimmed = nonEmpty(value);
    return trimmed ? [`- ${label}: ${trimmed}`] : [];
  });
  const refund = [
    input.refundOutcome
      ? `- Requested outcome: ${refundOutcomeLabels[input.refundOutcome]}`
      : null,
    nonEmpty(input.paddleTransactionId)
      ? `- Paddle transaction ID: ${input.paddleTransactionId!.trim()}`
      : null,
  ].filter((line): line is string => Boolean(line));
  const steps = nonEmpty(input.steps);

  if (details) lines.push("", "Details", details);
  if (environment.length > 0) lines.push("", "Environment", ...environment);
  if (refund.length > 0) lines.push("", "Refund request", ...refund);
  if (steps) lines.push("", "Steps tried", steps);

  return lines.join("\n");
}

export type SupportFailureType =
  | "email_unavailable"
  | "rate_limited"
  | "network_or_server"
  | "invalid_response";

export type SupportAnalyticsFailureType = "validation" | SupportFailureType;

export function supportSubmittedEventProperties(category: string): { category: string } {
  return { category };
}

export function supportFailedEventProperties(
  category: string,
  failureType: SupportAnalyticsFailureType,
): { category: string; failure_type: SupportAnalyticsFailureType } {
  return { category, failure_type: failureType };
}

export class SupportSubmissionError extends Error {
  readonly failureType: SupportFailureType;

  constructor(failureType: SupportFailureType, message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "SupportSubmissionError";
    this.failureType = failureType;
  }
}

export type SupportEmailResponse = { success: true; message_id: string };

type SupportRequestFetcher = typeof fetch;

function isRateLimitStatus(status: number): boolean {
  return status === 429;
}

export async function submitSupportRequest(
  input: SupportRequest,
  fetcher: SupportRequestFetcher = fetch,
): Promise<{ messageId: string }> {
  let response: Response;
  try {
    response = await fetcher("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch (error) {
    throw new SupportSubmissionError(
      "network_or_server",
      "Could not send the support request.",
      error,
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | Partial<SupportEmailResponse> & { failure_type?: SupportFailureType }
    | null;

  if (isRateLimitStatus(response.status) || payload?.failure_type === "rate_limited") {
    throw new SupportSubmissionError(
      "rate_limited",
      "Too many support requests. Please try again later.",
    );
  }
  if (!response.ok) {
    const failureType = payload?.failure_type;
    throw new SupportSubmissionError(
      failureType ?? "network_or_server",
      "Could not send the support request.",
    );
  }
  if (payload?.success !== true || typeof payload.message_id !== "string" || !payload.message_id.trim()) {
    throw new SupportSubmissionError(
      "invalid_response",
      "The support email service returned an invalid response.",
    );
  }

  return { messageId: payload.message_id };
}
