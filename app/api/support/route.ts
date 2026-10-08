import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  categoryLabels,
  formatSupportMessage,
  supportIntakeByCategory,
  supportRequestSchema,
  type SupportFailureType,
} from "@/lib/support-request";
import { logServerError } from "@/lib/server-logger";

export const runtime = "nodejs";

const SUPPORT_FROM = "hora Support <support@horacal.app>";

const INTAKE_ENV = {
  bugs: "LINEAR_INTAKE_BUGS",
  features: "LINEAR_INTAKE_FEATURES",
  billing: "LINEAR_INTAKE_BILLING",
  questions: "LINEAR_INTAKE_QUESTIONS",
} as const;

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

  const input = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  const intake = process.env[INTAKE_ENV[supportIntakeByCategory[input.category]]];
  if (!apiKey || !intake) {
    logServerError({
      route: "/api/support",
      operation: "support_intake_configuration",
    });
    return errorResponse(
      origin,
      503,
      "conversations_unavailable",
      "Support email is temporarily unavailable.",
    );
  }

  const name = headerValue(input.name);
  const email = input.email.trim();
  // Linear Asks replies to Reply-To, so the customer gets answers from the synced thread.
  const { data, error } = await new Resend(apiKey).emails
    .send({
      from: SUPPORT_FROM,
      to: intake,
      replyTo: email,
      subject: `[${categoryLabels[input.category]}] ${headerValue(input.summary)}`,
      text: `${formatSupportMessage(input)}\n\nRequester\n- ${name} <${email}>`,
    })
    .catch((cause: unknown) => ({
      data: null,
      error: { name: "network_error", message: String(cause) },
    }));

  if (error || !data?.id) {
    const rateLimited = error?.name === "rate_limit_exceeded" || isRateLimitedError(error?.message);
    logServerError({
      route: "/api/support",
      operation: "support_intake_send",
    });
    return errorResponse(
      origin,
      rateLimited ? 429 : 502,
      rateLimited ? "rate_limited" : error ? "network_or_server" : "invalid_response",
      "Could not create the support ticket. Please try again later.",
    );
  }

  return NextResponse.json(
    { success: true, ticket_id: data.id },
    { status: 201, headers: jsonHeaders(origin) },
  );
}
