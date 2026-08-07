import { createHmac } from "node:crypto";

export const DIRECT_APP_USER_ID_PREFIX = "usr_direct_v1_";
const CANONICAL_GOOGLE_ISSUER = "https://accounts.google.com";
const HMAC_CONTEXT = "hora.direct.revenuecat.v1";
const HMAC_KEY_PATTERN = /^[0-9a-fA-F]{64}$/;
const MAX_GOOGLE_SUBJECT_BYTES = 255;

type DirectIdentityEnvironment = {
  DIRECT_IDENTITY_HMAC_KEY_V1?: string;
};

function directIdentityHmacKey(
  environment: DirectIdentityEnvironment,
): Buffer {
  const encodedKey = environment.DIRECT_IDENTITY_HMAC_KEY_V1?.trim();
  if (!encodedKey || !HMAC_KEY_PATTERN.test(encodedKey)) {
    throw new Error("Direct identity HMAC key is not configured");
  }
  return Buffer.from(encodedKey, "hex");
}

// Derives one stable, opaque RevenueCat App User ID from a Google identity
// that has already been cryptographically verified. The HMAC key is versioned
// because replacing it would create different RevenueCat customers.
export function directAppUserIdForGoogleIdentity(
  issuer: string,
  googleSubject: string,
  environment: DirectIdentityEnvironment =
    process.env as DirectIdentityEnvironment,
): string {
  if (
    issuer !== CANONICAL_GOOGLE_ISSUER ||
    !googleSubject ||
    Buffer.byteLength(googleSubject, "utf8") > MAX_GOOGLE_SUBJECT_BYTES
  ) {
    throw new Error("Verified Google identity is invalid");
  }

  const digest = createHmac("sha256", directIdentityHmacKey(environment))
    .update(HMAC_CONTEXT, "utf8")
    .update("\0", "utf8")
    .update(issuer, "utf8")
    .update("\0", "utf8")
    .update(googleSubject, "utf8")
    .digest("base64url");

  return `${DIRECT_APP_USER_ID_PREFIX}${digest}`;
}
