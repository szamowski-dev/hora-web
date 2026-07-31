import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateBillingAppUserId } from "@/lib/billing/database";
import { verifyGoogleIdToken } from "@/lib/billing/google-openid";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  google_subject: z.string().min(1).max(255),
});

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function bearerToken(req: NextRequest): string | null {
  const authorization = req.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice("Bearer ".length).trim();
  return token || null;
}

export async function POST(req: NextRequest) {
  if (!checkRateLimit(`billing-identity:${clientIp(req)}`, 12)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again shortly." },
      { status: 429 },
    );
  }

  const token = bearerToken(req);
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!token || !parsed.success) {
    return NextResponse.json({ error: "Invalid sign-in proof." }, { status: 401 });
  }

  try {
    const identity = await verifyGoogleIdToken(token, parsed.data.google_subject);
    const appUserId = await getOrCreateBillingAppUserId(
      identity.issuer,
      identity.subject,
    );
    return NextResponse.json({ app_user_id: appUserId });
  } catch (error) {
    // Do not log credentials, raw Google subjects, or token-validation detail.
    if (
      error instanceof Error &&
      (error.message === "Billing database is not configured" ||
        error.message === "Google OpenID is not configured")
    ) {
      return NextResponse.json(
        { error: "Sandbox billing is not configured." },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "Unable to verify your Google sign-in." }, { status: 401 });
  }
}
