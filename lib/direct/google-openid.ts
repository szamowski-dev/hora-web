import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];
const CANONICAL_GOOGLE_ISSUER = "https://accounts.google.com";
const MAX_ID_TOKEN_BYTES = 16 * 1024;
const MAX_GOOGLE_SUBJECT_BYTES = 255;
const googleJwks = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

type GoogleOAuthEnvironment = {
  GOOGLE_OAUTH_NATIVE_CLIENT_IDS?: string;
};

type GoogleIdTokenVerificationOptions = {
  audiences?: string[];
  currentDate?: Date;
  key?: Parameters<typeof jwtVerify>[1];
};

export function googleOAuthAudiences(
  environment: GoogleOAuthEnvironment = process.env as GoogleOAuthEnvironment,
): string[] {
  const audiences = (
    environment.GOOGLE_OAUTH_NATIVE_CLIENT_IDS?.split(",") ?? []
  )
    .map((value) => value.trim())
    .filter(Boolean);
  const uniqueAudiences = [...new Set(audiences)];

  if (!uniqueAudiences.length) {
    throw new Error("Google OpenID audiences are not configured");
  }
  return uniqueAudiences;
}

export function identityFromVerifiedGooglePayload(
  payload: JWTPayload,
): { issuer: string; subject: string } {
  if (
    typeof payload.iss !== "string" ||
    !GOOGLE_ISSUERS.includes(payload.iss) ||
    typeof payload.sub !== "string" ||
    !payload.sub ||
    Buffer.byteLength(payload.sub, "utf8") > MAX_GOOGLE_SUBJECT_BYTES
  ) {
    throw new Error("Google OpenID identity is invalid");
  }

  return { issuer: CANONICAL_GOOGLE_ISSUER, subject: payload.sub };
}

export function bearerTokenFromAuthorization(
  authorization: string | null,
): string | null {
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);
  const token = match?.[1];
  if (!token || Buffer.byteLength(token, "utf8") > MAX_ID_TOKEN_BYTES) {
    return null;
  }
  return token;
}

export async function verifyGoogleIdToken(
  token: string,
  options: GoogleIdTokenVerificationOptions = {},
): Promise<{ issuer: string; subject: string }> {
  const { payload } = await jwtVerify(token, options.key ?? googleJwks, {
    algorithms: ["RS256"],
    issuer: GOOGLE_ISSUERS,
    audience: options.audiences ?? googleOAuthAudiences(),
    currentDate: options.currentDate,
    requiredClaims: ["iss", "sub", "aud", "exp", "iat"],
  });

  return identityFromVerifiedGooglePayload(payload);
}
