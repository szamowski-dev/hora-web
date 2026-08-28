import { headers } from "next/headers";
import { CookieConsentBanner } from "@/components/molecules/CookieConsentBanner";
import { requiresCookieConsent } from "@/lib/consent-policy";

export async function CookieConsentGate() {
  const countryCode = (await headers()).get("x-vercel-ip-country");

  return <CookieConsentBanner requiresConsent={requiresCookieConsent(countryCode)} />;
}
