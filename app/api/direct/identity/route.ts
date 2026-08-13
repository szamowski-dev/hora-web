import { createHash } from "node:crypto";
import { type NextRequest } from "next/server";
import {
  bearerTokenFromAuthorization,
  verifyGoogleIdToken,
} from "@/lib/direct/google-openid";
import { directAppUserIdForGoogleIdentity } from "@/lib/direct/identity";
import { directApiError, directJson } from "@/lib/direct/api-response";
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

export async function handleDirectIdentityRequest(
  request: NextRequest,
  dependencies: DirectIdentityDependencies = productionDependencies,
) {
  const token = bearerTokenFromAuthorization(
    request.headers.get("authorization"),
  );
  if (!token) {
    return directApiError("invalid_sign_in_proof", 401);
  }

  let identity: VerifiedGoogleIdentity;
  try {
    identity = await dependencies.verifyGoogleToken(token);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Google OpenID audiences are not configured"
    ) {
      return directApiError("direct_identity_not_configured", 503, {
        retryable: true,
        retryAfterSeconds: 60,
      });
    }
    return directApiError("google_sign_in_invalid", 401);
  }

  if (
    !dependencies.checkRequestLimit(
      identityRateLimitKey(identity.issuer, identity.subject),
      30,
    )
  ) {
    return directApiError("rate_limited", 429, {
      retryable: true,
      retryAfterSeconds: 600,
    });
  }

  try {
    const appUserId = await dependencies.resolveAppUserId(
      identity.issuer,
      identity.subject,
    );
    return directJson({ app_user_id: appUserId });
  } catch {
    return directApiError("identity_unavailable", 503, {
      retryable: true,
      retryAfterSeconds: 30,
    });
  }
}

export async function POST(request: NextRequest) {
  return handleDirectIdentityRequest(request);
}
