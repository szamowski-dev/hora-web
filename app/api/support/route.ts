import { type NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  categoryLabels,
  formatSupportMessage,
  supportRequestSchema,
  supportTicketMetadata,
  type SupportFailureType,
} from "@/lib/support-request";
import { logServerError } from "@/lib/server-logger";

export const runtime = "nodejs";

const POSTHOG_API_HOST = (process.env.POSTHOG_API_HOST ?? "https://us.posthog.com").replace(
  /\/+$/,
  "",
);

const ALLOWED_ORIGINS = new Set([
  "https://horacal.app",
  "http://localhost:3000",
]);

function corsHeaders(origin: string | null): HeadersInit {
  const allow =
    origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://horacal.app";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonHeaders(origin: string | null): HeadersInit {
  return { ...corsHeaders(origin), "Content-Type": "application/json" };
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function headerValue(value: string): string {
  return value.replace(/[\r\n"]/g, " ").replace(/\s+/g, " ").trim();
}

function isRateLimitedError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /\b429\b|rate.?limit|too many requests/i.test(message);
}

function errorResponse(
  origin: string | null,
  status: number,
  failureType: SupportFailureType,
  error: string,
) {
  return NextResponse.json(
    { error, failure_type: failureType },
    { status, headers: jsonHeaders(origin) },
  );
}

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(req.headers.get("origin")) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const ip = getClientIp(req);

  if (!checkRateLimit(`support-email:${ip}`, 5)) {
    return errorResponse(
      origin,
      429,
      "rate_limited",
      "Too many support requests. Try again later.",
    );
  }

  const body = await req.json().catch(() => null);
  if (
    body &&
    typeof body === "object" &&
    "honey" in body &&
    typeof body.honey === "string" &&
    body.honey.trim()
  ) {
    return NextResponse.json(
      { success: true, ticket_id: "honeypot" },
      { status: 201, headers: jsonHeaders(origin) },
    );
  }

  const parsed = supportRequestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      origin,
      400,
      "invalid_response",
      "Please check the form and try again.",
    );
  }

  const posthogApiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const emailConfigId = process.env.POSTHOG_SUPPORT_EMAIL_CONFIG_ID;
  if (!posthogApiKey || !projectId || !emailConfigId) {
    logServerError({
      route: "/api/support",
      operation: "posthog_support_configuration",
    });
    return errorResponse(
      origin,
      503,
      "conversations_unavailable",
      "Support email is temporarily unavailable.",
    );
  }

  const input = parsed.data;
  const subject = `[${categoryLabels[input.category]}] ${headerValue(input.summary)}`;
  let result: Response;
  try {
    result = await fetch(
      `${POSTHOG_API_HOST}/api/projects/${encodeURIComponent(projectId)}/conversations/tickets/compose/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${posthogApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient_email: input.email.trim(),
          email_subject: subject,
          email_config_id: emailConfigId,
          message: formatSupportMessage(input),
        }),
      },
    );
  } catch (error) {
    logServerError({
      route: "/api/support",
      operation: "posthog_support_ticket_creation",
    });
    return errorResponse(
      origin,
      isRateLimitedError(error) ? 429 : 502,
      isRateLimitedError(error) ? "rate_limited" : "network_or_server",
      "Could not create the support ticket. Please try again later.",
    );
  }

  const payload = (await result.json().catch(() => null)) as
    | { id?: unknown; ticket_id?: unknown; detail?: unknown; error?: unknown }
    | null;
  if (!result.ok) {
    logServerError({
      route: "/api/support",
      operation: "posthog_support_ticket_rejected",
      statusCode: result.status,
    });
    const rateLimited = result.status === 429 || isRateLimitedError(payload?.detail);
    const unavailable = [401, 403, 404].includes(result.status);
    return errorResponse(
      origin,
      rateLimited ? 429 : 502,
      rateLimited
        ? "rate_limited"
        : unavailable
          ? "conversations_unavailable"
          : "network_or_server",
      "Could not create the support ticket. Please try again later.",
    );
  }

  const ticketId =
    typeof payload?.id === "string" && payload.id.trim()
      ? payload.id.trim()
      : typeof payload?.ticket_id === "string" && payload.ticket_id.trim()
        ? payload.ticket_id.trim()
        : null;
  if (!ticketId) {
    logServerError({
      route: "/api/support",
      operation: "posthog_support_ticket_invalid_response",
    });
    return errorResponse(
      origin,
      502,
      "invalid_response",
      "Could not create the support ticket. Please try again later.",
    );
  }

  const metadata = supportTicketMetadata[input.category];
  let metadataResult: Response;
  try {
    metadataResult = await fetch(
      `${POSTHOG_API_HOST}/api/projects/${encodeURIComponent(projectId)}/conversations/tickets/${encodeURIComponent(ticketId)}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${posthogApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      },
    );
  } catch (error) {
    logServerError({
      route: "/api/support",
      operation: "posthog_support_metadata_update",
    });
    return errorResponse(
      origin,
      isRateLimitedError(error) ? 429 : 502,
      isRateLimitedError(error) ? "rate_limited" : "network_or_server",
      "Could not finish setting up the support ticket. Please try again later.",
    );
  }

  if (!metadataResult.ok) {
    logServerError({
      route: "/api/support",
      operation: "posthog_support_metadata_rejected",
      statusCode: metadataResult.status,
    });
    const rateLimited = metadataResult.status === 429;
    return errorResponse(
      origin,
      rateLimited ? 429 : 502,
      rateLimited ? "rate_limited" : "network_or_server",
      "Could not finish setting up the support ticket. Please try again later.",
    );
  }

  return NextResponse.json(
    { success: true, ticket_id: ticketId },
    { status: 201, headers: jsonHeaders(origin) },
  );
}
