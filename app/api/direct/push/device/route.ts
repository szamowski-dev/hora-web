import { createHash } from "node:crypto";
import { type NextRequest } from "next/server";
import { z } from "zod";
import { directApiError, directJson } from "@/lib/direct/api-response";
import {
  bearerTokenFromAuthorization,
  verifyGoogleIdToken,
} from "@/lib/direct/google-openid";
import { directAppUserIdForGoogleIdentity } from "@/lib/direct/identity";
import {
  sendDirectPushDeviceCommand,
  type DirectPushDeviceCommand,
} from "@/lib/direct/push-worker";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 2_048;
const APNS_TOKEN_PATTERN = /^(?:[0-9a-fA-F]{2}){16,100}$/;
const pushDeviceRequestSchema = z
  .object({
    action: z.enum(["register", "unregister"]),
    apns_token: z.string().regex(APNS_TOKEN_PATTERN),
    apns_environment: z.enum(["sandbox", "production"]),
  })
  .strict();

type VerifiedGoogleIdentity = Awaited<ReturnType<typeof verifyGoogleIdToken>>;

export type DirectPushDeviceDependencies = {
  verifyGoogleToken: (token: string) => Promise<VerifiedGoogleIdentity>;
  resolveAppUserId: (issuer: string, subject: string) => Promise<string>;
  checkRequestLimit: (key: string, limit: number) => boolean;
  sendDeviceCommand: (command: DirectPushDeviceCommand) => Promise<void>;
};

const productionDependencies: DirectPushDeviceDependencies = {
  verifyGoogleToken: verifyGoogleIdToken,
  resolveAppUserId: async (issuer, subject) =>
    directAppUserIdForGoogleIdentity(issuer, subject),
  checkRequestLimit: checkRateLimit,
  sendDeviceCommand: sendDirectPushDeviceCommand,
};

function pushRateLimitKey(issuer: string, subject: string): string {
  const digest = createHash("sha256")
    .update(`${issuer}\0${subject}`)
    .digest("base64url");
  return `direct-push-device:${digest}`;
}

async function boundedRequestBody(request: NextRequest): Promise<string> {
  if (!request.body) throw new Error("Request body is missing");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteCount = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    byteCount += value.byteLength;
    if (byteCount > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("Request body is too large");
    }
    chunks.push(value);
  }

  return Buffer.concat(chunks).toString("utf8");
}

export async function handleDirectPushDeviceRequest(
  request: NextRequest,
  dependencies: DirectPushDeviceDependencies = productionDependencies,
) {
  const token = bearerTokenFromAuthorization(
    request.headers.get("authorization"),
  );
  if (!token) return directApiError("invalid_sign_in_proof", 401);

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return directApiError("invalid_request", 400);
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
      pushRateLimitKey(identity.issuer, identity.subject),
      60,
    )
  ) {
    return directApiError("rate_limited", 429, {
      retryable: true,
      retryAfterSeconds: 600,
    });
  }

  let body: z.infer<typeof pushDeviceRequestSchema>;
  try {
    const rawBody = await boundedRequestBody(request);
    body = pushDeviceRequestSchema.parse(JSON.parse(rawBody));
  } catch {
    return directApiError("invalid_request", 400);
  }

  let appUserId: string;
  try {
    appUserId = await dependencies.resolveAppUserId(
      identity.issuer,
      identity.subject,
    );
  } catch {
    return directApiError("identity_unavailable", 503, {
      retryable: true,
      retryAfterSeconds: 30,
    });
  }

  try {
    await dependencies.sendDeviceCommand({
      ...body,
      apns_token: body.apns_token.toLowerCase(),
      app_user_id: appUserId,
    });
    return directJson({ ok: true });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Direct push worker is not configured"
    ) {
      return directApiError("push_registration_not_configured", 503, {
        retryable: true,
        retryAfterSeconds: 60,
      });
    }
    return directApiError("push_registration_unavailable", 503, {
      retryable: true,
      retryAfterSeconds: 30,
    });
  }
}

export async function POST(request: NextRequest) {
  return handleDirectPushDeviceRequest(request);
}
