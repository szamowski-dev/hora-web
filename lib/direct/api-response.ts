import { NextResponse } from "next/server";

export type DirectApiErrorCode =
  | "invalid_sign_in_proof"
  | "google_sign_in_invalid"
  | "direct_identity_not_configured"
  | "rate_limited"
  | "identity_unavailable"
  | "invalid_request"
  | "push_registration_not_configured"
  | "push_registration_unavailable";

type DirectApiError = {
  code: DirectApiErrorCode;
  retryable: boolean;
  retry_after_seconds?: number;
};

const BASE_HEADERS = {
  "Cache-Control": "private, no-store",
  Vary: "Authorization",
  "X-Content-Type-Options": "nosniff",
} as const;

export function directJson(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: BASE_HEADERS });
}

export function directApiError(
  code: DirectApiErrorCode,
  status: number,
  options: { retryable?: boolean; retryAfterSeconds?: number } = {},
) {
  const body: DirectApiError = {
    code,
    retryable: options.retryable ?? false,
    ...(options.retryAfterSeconds
      ? { retry_after_seconds: options.retryAfterSeconds }
      : {}),
  };
  const headers = {
    ...BASE_HEADERS,
    ...(options.retryAfterSeconds
      ? { "Retry-After": String(options.retryAfterSeconds) }
      : {}),
  };

  return NextResponse.json(body, { status, headers });
}
