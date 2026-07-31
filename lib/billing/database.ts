import { randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";

type IdentityRow = { app_user_id: string };

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Billing database is not configured");
  }
  return databaseUrl;
}

function newAppUserId(): string {
  return `usr_${randomBytes(24).toString("base64url")}`;
}

/**
 * Returns an opaque ID. It is generated randomly and cannot be used to
 * recover the Google subject or any other Google account information.
 */
export async function getOrCreateBillingAppUserId(
  issuer: string,
  googleSubject: string,
): Promise<string> {
  const sql = neon(getDatabaseUrl());
  const rows = (await sql`
    INSERT INTO billing_identities (issuer, google_subject, app_user_id)
    VALUES (${issuer}, ${googleSubject}, ${newAppUserId()})
    ON CONFLICT (issuer, google_subject)
    DO UPDATE SET issuer = EXCLUDED.issuer
    RETURNING app_user_id
  `) as IdentityRow[];

  const appUserId = rows[0]?.app_user_id;
  if (!appUserId) {
    throw new Error("Billing identity could not be created");
  }
  return appUserId;
}
