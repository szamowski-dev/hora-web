import type { Metadata } from "next";
import { BillingExperience } from "@/components/billing/BillingExperience";
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
    <section className="pt-20 sm:pt-32">
      <div className="px-5 text-center sm:px-10">
        <h1 className="mx-auto max-w-4xl text-balance text-5xl font-semibold tracking-[-0.065em] text-text sm:text-7xl">Choose your Direct plan</h1>
      </div>
      <BillingExperience mode="pricing" />
    </section>
  );
}
