import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.WEB_BILLING_PUBLIC_API_KEY;
  const googleClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  if (
    !key ||
    !googleClientId ||
    process.env.WEB_BILLING_ENVIRONMENT !== "sandbox" ||
    key.startsWith("appl_")
  ) {
    return NextResponse.json(
      { error: "Sandbox web billing is not configured." },
      { status: 503 },
    );
  }

  return NextResponse.json({
    webBillingPublicApiKey: key,
    googleClientId,
  });
}
