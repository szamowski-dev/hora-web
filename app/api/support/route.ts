import { type NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  supportTicketMetadata,
  supportTicketMetadataRequestSchema,
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

  // Ticket creation happens in PostHog's client Support API. This endpoint
  // only applies category metadata with the server-only personal API key.
  if (!checkRateLimit(`support-ticket-metadata:${ip}`, 5)) {
    return errorResponse(
      origin,
      429,
      "rate_limited",
      "Too many support requests. Try again later.",
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = supportTicketMetadataRequestSchema.safeParse(body);
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
  if (!posthogApiKey || !projectId) {
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
  const metadata = supportTicketMetadata[input.category];
  let metadataResult: Response;
  try {
    metadataResult = await fetch(
      `${POSTHOG_API_HOST}/api/projects/${encodeURIComponent(projectId)}/conversations/tickets/${encodeURIComponent(input.ticket_id)}/`,
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
      "Could not update the support ticket. Please try again later.",
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
      "Could not update the support ticket. Please try again later.",
    );
  }

  return NextResponse.json(
    { success: true },
    { headers: jsonHeaders(origin) },
  );
}
