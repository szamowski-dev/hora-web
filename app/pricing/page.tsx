import type { Metadata } from "next";
import {
  PRICING_SUMMARY,
  PricingSection,
} from "@/components/organisms/PricingSection";
import { SitePageHero } from "@/components/templates/SitePageHero";
import { getHomePage } from "@/lib/home-repository";
import { defaultOg } from "@/lib/og";

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

export default async function PricingPage() {
  const { pricing } = await getHomePage();

  return (
    <>
      <SitePageHero
        align="center"
        title={`${pricing.titlePrefix} ${pricing.titleAccent}`}
        description={PRICING_SUMMARY}
      />
      <PricingSection content={pricing} />
    </>
  );
}
