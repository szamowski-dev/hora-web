import { createRemoteJWKSet, jwtVerify } from "jose";

const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];
const googleJwks = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

function googleClientId(): string {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  if (!clientId) throw new Error("Google OpenID is not configured");
  return clientId;
}

export async function verifyGoogleIdToken(
  token: string,
  claimedSubject: string,
): Promise<{ issuer: string; subject: string }> {
  const { payload } = await jwtVerify(token, googleJwks, {
    algorithms: ["RS256"],
    issuer: GOOGLE_ISSUERS,
    audience: googleClientId(),
  });

  if (
    typeof payload.iss !== "string" ||
    typeof payload.sub !== "string" ||
    payload.sub !== claimedSubject
  ) {
    throw new Error("Google OpenID subject mismatch");
  }

  // Google documents both issuer spellings. Canonicalizing prevents the same
  // Google account from receiving a different app user ID across clients.
  return { issuer: "https://accounts.google.com", subject: payload.sub };
}
