import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rate-limit";
import { normalizeEmail } from "@/lib/identity";
import { logServerError } from "@/lib/server-logger";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email().max(254),
});
const RESEND_WAITLIST_EVENT = "hora Calendar Waitlist";

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

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(req.headers.get("origin")) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const headers = jsonHeaders(origin);

  const ip = getClientIp(req);
  if (!checkRateLimit(`subscribe:${ip}`)) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429, headers },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid email" },
      { status: 400, headers },
    );
  }

  const email = normalizeEmail(parsed.data.email);
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    logServerError({
      route: "/api/subscribe",
      operation: "resend_configuration",
    });
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500, headers },
    );
  }

  const resend = new Resend(apiKey);

  const contact = await resend.contacts.create({
    audienceId,
    email,
    unsubscribed: false,
  });
  if (contact.error) {
    logServerError({
      route: "/api/subscribe",
      operation: "resend_contact_create",
    });
    return NextResponse.json(
      { error: contact.error.message },
      { status: 500, headers },
    );
  }

  const event = await resend.events.send({
    event: RESEND_WAITLIST_EVENT,
    email,
    payload: {
      source: "website_waitlist",
    },
  });
  if (event.error) {
    logServerError({
      route: "/api/subscribe",
      operation: "resend_event_send",
    });
    return NextResponse.json(
      { error: event.error.message },
      { status: 500, headers },
    );
  }

  return NextResponse.json({ success: true }, { headers });
}
