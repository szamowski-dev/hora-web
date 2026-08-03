import { type NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getOrCreateDirectAppUserId } from "@/lib/direct/database";
import {
  bearerTokenFromAuthorization,
  verifyGoogleIdToken,
} from "@/lib/direct/google-openid";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VerifiedGoogleIdentity = Awaited<ReturnType<typeof verifyGoogleIdToken>>;

export type DirectIdentityDependencies = {
  verifyGoogleToken: (token: string) => Promise<VerifiedGoogleIdentity>;
  getOrCreateAppUserId: (issuer: string, subject: string) => Promise<string>;
  checkRequestLimit: (key: string, limit: number) => boolean;
};

const productionDependencies: DirectIdentityDependencies = {
  verifyGoogleToken: verifyGoogleIdToken,
  getOrCreateAppUserId: getOrCreateDirectAppUserId,
  checkRequestLimit: checkRateLimit,
};

function identityRateLimitKey(issuer: string, subject: string): string {
  const digest = createHash("sha256")
    .update(`${issuer}\u0000${subject}`)
    .digest("base64url");
  return `direct-identity:${digest}`;
}

function json(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function handleDirectIdentityRequest(
  req: NextRequest,
  dependencies: DirectIdentityDependencies = productionDependencies,
) {
  const token = bearerTokenFromAuthorization(req.headers.get("authorization"));
  if (!token) {
    return json({ error: "Invalid sign-in proof." }, 401);
  }

  let identity: Awaited<ReturnType<typeof verifyGoogleIdToken>>;
  try {
    identity = await dependencies.verifyGoogleToken(token);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Google OpenID audiences are not configured"
    ) {
      return json({ error: "Direct identity is not configured." }, 503);
    }
    return json({ error: "Unable to verify your Google sign-in." }, 401);
  }

  // Apply the lightweight abuse guard only after cryptographic verification.
  // This avoids one shared NAT address, or a missing proxy header, blocking
  // unrelated signed-in users before their identity is known.
  if (
    !dependencies.checkRequestLimit(
      identityRateLimitKey(identity.issuer, identity.subject),
      30,
    )
  ) {
    return json({ error: "Too many attempts. Try again shortly." }, 429);
  }

  try {
    const appUserId = await dependencies.getOrCreateAppUserId(
      identity.issuer,
      identity.subject,
    );
    return json({ app_user_id: appUserId });
  } catch {
    // Keep database details and the verified Google subject out of logs and the
    // response. This is an infrastructure failure, not an authentication error.
    return json({ error: "Direct identity is temporarily unavailable." }, 503);
  }
}

export async function POST(req: NextRequest) {
  return handleDirectIdentityRequest(req);
}
