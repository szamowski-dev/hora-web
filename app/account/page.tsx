import type { Metadata } from "next";
import { BillingExperience } from "@/components/billing/BillingExperience";
import { SitePageHero } from "@/components/templates/SitePageHero";

export const metadata: Metadata = {
  title: "Account",
  description: "View your hora Calendar Direct entitlements.",
  alternates: { canonical: "/account/" },
};

export default function AccountPage() {
  return (
    <>
      <SitePageHero
        align="center"
        title="Your hora account"
        description="Sign in with the same Google account you use in hora to see your Direct purchase."
      />
      <BillingExperience mode="account" />
    </>
  );
}
