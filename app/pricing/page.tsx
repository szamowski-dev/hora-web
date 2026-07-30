import type { Metadata } from "next";
import { PricingSection } from "@/components/organisms/PricingSection";
import { SitePageHero } from "@/components/templates/SitePageHero";
import { getHomePage } from "@/lib/home-repository";
import { defaultOg } from "@/lib/og";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the hora Calendar plan that fits how you work on Mac, iPhone, and iPad.",
  alternates: { canonical: "/pricing/" },
  openGraph: defaultOg({
    title: "hora Calendar Pricing",
    description:
      "Choose the hora Calendar plan that fits how you work on Mac, iPhone, and iPad.",
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
        description={pricing.description}
      />
      <PricingSection content={pricing} />
    </>
  );
}
