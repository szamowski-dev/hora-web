import type { Metadata } from "next";
import { MdCheck, MdDownloadForOffline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_EVENTS, ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import { defaultOg } from "@/lib/og";

const PRICING_SUMMARY =
  "Download hora Calendar Direct, then choose a $29.99 annual plan with a 14-day trial or a $49 lifetime license.";

const plans = [
  {
    name: "Annual",
    price: "$29.99",
    suffix: "/year",
    description: "A 14-day free trial after checkout, then renews yearly.",
    featured: false,
  },
  {
    name: "Lifetime",
    price: "$49",
    suffix: " one time",
    description: "One payment for ongoing access to the Direct edition.",
    featured: true,
  },
] as const;

const features = [
  "Native Mac app",
  "Direct Google Calendar integration",
  "The same pro access across supported hora editions",
] as const;

export const metadata: Metadata = {
  title: "Pricing",
  description: PRICING_SUMMARY,
  alternates: { canonical: "/pricing/" },
  openGraph: defaultOg({
    title: "hora Calendar Direct Pricing",
    description: PRICING_SUMMARY,
    url: "https://horacal.app/pricing/",
  }),
};

export default function PricingPage() {
  return (
    <main className="px-5 pb-28 pt-28 sm:px-10 sm:pb-40 sm:pt-40">
      <div className="mx-auto max-w-4xl">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-5xl font-semibold tracking-[-0.065em] text-text sm:text-7xl">
            Download first. Choose your plan in the app.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-8 text-muted sm:text-xl">
            Get the signed Direct build for Mac. After signing in, the secure
            checkout offers Annual and Lifetime access.
          </p>
        </header>

        <section aria-label="Direct plans" className="mt-14 grid gap-5 md:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.featured ? "border-accent/35 bg-accent/[0.055]" : ""}
            >
              <CardHeader>
                <CardDescription className="font-semibold uppercase tracking-[0.14em]">
                  {plan.name}
                </CardDescription>
                <CardTitle className="mt-3 text-5xl tracking-[-0.055em]">
                  {plan.price}
                  <span className="ml-1 text-lg font-medium tracking-normal text-muted">
                    {plan.suffix}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm leading-6 text-muted">{plan.description}</p>
                <ul className="mt-7 space-y-3 text-sm text-text">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <MdCheck className="mt-0.5 size-5 text-success" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild size="lg" variant={plan.featured ? "accent" : "outline"} className="w-full">
                  <a
                    href={site.cta.direct.href}
                    {...analyticsAttrs(ANALYTICS_EVENTS.downloadClick, {
                      placement: ANALYTICS_PLACEMENTS.pricing,
                      destination: "direct_download",
                      plan: plan.name.toLowerCase(),
                    })}
                  >
                    <MdDownloadForOffline data-icon="inline-start" aria-hidden />
                    {site.cta.direct.label}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-6 text-muted">
          The installer is notarized and updates through the Direct release
          channel. Checkout and license management are handled securely by
          RevenueCat and Paddle.
        </p>
      </div>
    </main>
  );
}
