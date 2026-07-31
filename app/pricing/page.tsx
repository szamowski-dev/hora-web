import type { Metadata } from "next";
import { BillingExperience } from "@/components/billing/BillingExperience";
import { SitePageHero } from "@/components/templates/SitePageHero";
import { defaultOg } from "@/lib/og";

const PRICING_SUMMARY = "Secure sandbox checkout for hora Calendar Direct.";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Pricing",
  description: PRICING_SUMMARY,
  alternates: { canonical: "/pricing/" },
  openGraph: defaultOg({
    title: "hora Calendar Pricing",
    description: PRICING_SUMMARY,
    url: "https://horacal.app/pricing/",
  }),
};

export default function PricingPage() {
  return (
    <>
      <SitePageHero
        align="center"
        title="Choose your Direct plan"
        description="Sign in with Google to see the sandbox Annual and Lifetime options. Your 14-day Direct app trial remains in the native app."
      />
      <BillingExperience mode="pricing" />
    </>
  );
}
