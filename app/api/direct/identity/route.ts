import { createHash } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import {
  bearerTokenFromAuthorization,
  verifyGoogleIdToken,
} from "@/lib/direct/google-openid";
import { directAppUserIdForGoogleIdentity } from "@/lib/direct/identity";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VerifiedGoogleIdentity = Awaited<ReturnType<typeof verifyGoogleIdToken>>;

export type DirectIdentityDependencies = {
  verifyGoogleToken: (token: string) => Promise<VerifiedGoogleIdentity>;
  resolveAppUserId: (issuer: string, subject: string) => Promise<string>;
  checkRequestLimit: (key: string, limit: number) => boolean;
};

const productionDependencies: DirectIdentityDependencies = {
  verifyGoogleToken: verifyGoogleIdToken,
  resolveAppUserId: async (issuer, subject) =>
    directAppUserIdForGoogleIdentity(issuer, subject),
  checkRequestLimit: checkRateLimit,
};

function identityRateLimitKey(issuer: string, subject: string): string {
  const digest = createHash("sha256")
    .update(`${issuer}\0${subject}`)
    .digest("base64url");
  return `direct-identity:${digest}`;
}

function json(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      Vary: "Authorization",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function handleDirectIdentityRequest(
  request: NextRequest,
  dependencies: DirectIdentityDependencies = productionDependencies,
) {
  const token = bearerTokenFromAuthorization(
    request.headers.get("authorization"),
  );
  if (!token) {
    return json({ error: "Invalid sign-in proof." }, 401);
  }

  let identity: VerifiedGoogleIdentity;
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

  if (
    !dependencies.checkRequestLimit(
      identityRateLimitKey(identity.issuer, identity.subject),
      30,
    )
  ) {
    return json({ error: "Too many attempts. Try again shortly." }, 429);
  }

  try {
    const appUserId = await dependencies.resolveAppUserId(
      identity.issuer,
      identity.subject,
    );
    return json({ app_user_id: appUserId });
  } catch {
    return json({ error: "Direct identity is temporarily unavailable." }, 503);
  }
}

export async function POST(request: NextRequest) {
  return handleDirectIdentityRequest(request);
}
