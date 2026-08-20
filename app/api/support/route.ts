import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  categoryLabels,
  formatSupportMessage,
  supportRequestSchema,
  type SupportFailureType,
} from "@/lib/support-request";

export const runtime = "nodejs";

const POSTHOG_SUPPORT_INBOUND_EMAIL =
  process.env.POSTHOG_SUPPORT_INBOUND_EMAIL ??
  "team-9fb21ee080d1977fa58d3f33aff2f0db@mg.posthog.com";
const DEFAULT_SUPPORT_FROM = "Hora Support <support@horacal.app>";

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

  // Unlike the browser Conversations API, this endpoint sends email using our
  // provider and therefore needs a small server-side abuse guard.
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
      { success: true, message_id: "honeypot" },
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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is missing for support email intake");
    return errorResponse(
      origin,
      503,
      "email_unavailable",
      "Support email is temporarily unavailable.",
    );
  }

  const input = parsed.data;
  const subject = `[${categoryLabels[input.category]}] ${headerValue(input.summary)}`;
  const replyTo = `${headerValue(input.name)} <${input.email.trim()}>`;
  const resend = new Resend(apiKey);

  let result;
  try {
    result = await resend.emails.send({
      from: process.env.SUPPORT_EMAIL_FROM ?? DEFAULT_SUPPORT_FROM,
      to: POSTHOG_SUPPORT_INBOUND_EMAIL,
      replyTo,
      subject,
      text: formatSupportMessage(input),
    });
  } catch (error) {
    console.error("Support email send failed", error);
    return errorResponse(
      origin,
      isRateLimitedError(error) ? 429 : 502,
      isRateLimitedError(error) ? "rate_limited" : "network_or_server",
      "Could not send the support request. Please try again later.",
    );
  }

  if (result.error || !result.data?.id) {
    console.error("Support email provider rejected the message", result.error);
    const rateLimited = isRateLimitedError(result.error);
    return errorResponse(
      origin,
      rateLimited ? 429 : 502,
      rateLimited ? "rate_limited" : "network_or_server",
      "Could not send the support request. Please try again later.",
    );
  }

  return NextResponse.json(
    { success: true, message_id: result.data.id },
    { status: 201, headers: jsonHeaders(origin) },
  );
}
