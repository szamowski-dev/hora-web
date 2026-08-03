import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function decodeToken(token: string): string | null {
  try {
    const email = Buffer.from(token, "base64").toString("utf-8");
    if (!email.includes("@")) return null;
    return email;
  } catch {
    return null;
  }
}

async function removeContact(email: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    console.error("Resend env vars missing");
    return false;
  }
  const resend = new Resend(apiKey);
  const res = await resend.contacts.remove({ audienceId, email });
  if (res.error) {
    // Treat "not found" as success — the desired end state is achieved.
    if (String(res.error.message).toLowerCase().includes("not found")) return true;
    console.error("Resend contacts.remove failed", res.error);
    return false;
  }
  return true;
}

function renderConfirmation(success: boolean): string {
  const heading = success
    ? "You've been unsubscribed"
    : "Something went wrong";
  const body = success
    ? 'You won\'t receive any more emails from hora Calendar. If this was a mistake, you can sign up again at <a href="https://horacal.app">horacal.app</a>.'
    : 'Please try again, or email <a href="mailto:hello@horacal.app">hello@horacal.app</a> and we will remove you manually.';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed — hora Calendar</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: oklch(0.144788 0 0); color: oklch(0.985104 0 0); display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { max-width: 420px; padding: 2rem; text-align: center; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: oklch(0.713660 0.019176 261.325); line-height: 1.6; }
    a { color: oklch(0.653197 0.232821 25.739); text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${heading}</h1>
    <p>${body}</p>
  </div>
</body>
</html>`;
}

async function handle(req: NextRequest, asHtml: boolean): Promise<Response> {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return new Response("Missing token", { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (!checkRateLimit(`unsubscribe:${ip}`, 10)) {
    return new Response("Too many requests", { status: 429 });
  }

  const email = decodeToken(token);
  if (!email) {
    return new Response("Invalid token", { status: 400 });
  }

  const ok = await removeContact(email);

  if (asHtml) {
    return new Response(renderConfirmation(ok), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
  return NextResponse.json({ success: ok });
}

export async function GET(req: NextRequest) {
  return handle(req, true);
}

export async function POST(req: NextRequest) {
  return handle(req, false);
}
