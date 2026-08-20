import { z } from "zod";
import type {
  SendMessageResponse,
  TicketStatus,
  UserProvidedTraits,
} from "posthog-js";

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

export type ConversationsClient = {
  isAvailable(): boolean;
  getCurrentTicketId(): string | null;
  getMessages(ticketId?: string): Promise<
    | { ticket_id: string; ticket_status: TicketStatus; messages?: unknown[] }
    | null
  >;
  sendMessage(
    message: string,
    userTraits?: UserProvidedTraits,
    newTicket?: boolean,
  ): Promise<SendMessageResponse | null>;
};

export type SupportFailureType =
  | "conversations_unavailable"
  | "rate_limited"
  | "ticket_lookup_failed"
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

function isActiveTicketStatus(status: TicketStatus): boolean {
  return ["new", "open", "pending", "on_hold"].includes(status);
}

function isTicketStatus(value: unknown): value is TicketStatus {
  return ["new", "open", "pending", "on_hold", "resolved"].includes(value as TicketStatus);
}

function isRateLimitError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /\b429\b|rate.?limit|too many requests/i.test(message);
}

export async function waitForConversations(
  client: Pick<ConversationsClient, "isAvailable">,
  timeoutMs = 5_000,
  intervalMs = 100,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    try {
      if (client.isAvailable()) return;
    } catch {
      // The SDK can still be finalizing remote config. Keep polling until the deadline.
    }
    if (Date.now() >= deadline) break;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new SupportSubmissionError(
    "conversations_unavailable",
    "PostHog Conversations is not available.",
  );
}

export async function submitSupportRequest(
  client: ConversationsClient,
  input: SupportRequest,
  options?: { availabilityTimeoutMs?: number; availabilityIntervalMs?: number },
): Promise<{ ticketId: string; appended: boolean }> {
  await waitForConversations(
    client,
    options?.availabilityTimeoutMs,
    options?.availabilityIntervalMs,
  );

  const message = formatSupportMessage(input);
  const userTraits: UserProvidedTraits = {
    name: input.name.trim(),
    email: input.email.trim(),
  };

  let currentTicketId: string | null = null;
  try {
    currentTicketId = client.getCurrentTicketId();
  } catch (error) {
    throw new SupportSubmissionError(
      isRateLimitError(error) ? "rate_limited" : "network_or_server",
      "Could not read the current support ticket.",
      error,
    );
  }

  let appendToTicket = false;
  if (currentTicketId) {
    let ticket;
    try {
      ticket = await client.getMessages(currentTicketId);
    } catch (error) {
      throw new SupportSubmissionError(
        isRateLimitError(error) ? "rate_limited" : "ticket_lookup_failed",
        "Could not look up the current support ticket.",
        error,
      );
    }
    if (!ticket) {
      throw new SupportSubmissionError(
        "ticket_lookup_failed",
        "Could not look up the current support ticket.",
      );
    }
    if (!isTicketStatus(ticket.ticket_status)) {
      throw new SupportSubmissionError(
        "invalid_response",
        "PostHog Conversations returned an invalid ticket response.",
      );
    }
    if (isActiveTicketStatus(ticket.ticket_status)) appendToTicket = true;
  }

  let response: SendMessageResponse | null;
  try {
    response = appendToTicket
      ? await client.sendMessage(message, userTraits)
      : await client.sendMessage(message, userTraits, true);
  } catch (error) {
    throw new SupportSubmissionError(
      isRateLimitError(error) ? "rate_limited" : "network_or_server",
      "Could not send the support request.",
      error,
    );
  }

  if (!response) {
    throw new SupportSubmissionError(
      "conversations_unavailable",
      "PostHog Conversations returned no response.",
    );
  }
  if (typeof response.ticket_id !== "string" || response.ticket_id.trim() === "") {
    throw new SupportSubmissionError(
      "invalid_response",
      "PostHog Conversations returned an invalid response.",
    );
  }

  return { ticketId: response.ticket_id, appended: appendToTicket };
}
