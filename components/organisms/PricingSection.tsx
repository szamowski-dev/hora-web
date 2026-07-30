import Link from "next/link";
import {
  MdCheck,
  MdDevices,
  MdFamilyRestroom,
  MdOpenInNew,
} from "react-icons/md";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { SetappBadge } from "@/components/atoms/SetappBadge";
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
import { ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import type { HomePageContent } from "@/lib/home-model";

export function PricingSection({
  content,
  compact = false,
}: {
  content: HomePageContent["pricing"];
  compact?: boolean;
}) {
  return (
    <section
      id="pricing"
      className={compact ? "px-1 pb-2 pt-1" : "px-5 pb-28 sm:px-10 sm:pb-40"}
    >
      <div className="mx-auto max-w-landing">
        {compact ? null : (
          <div className="mx-auto mb-12 grid max-w-4xl gap-5 text-center sm:grid-cols-2 sm:text-left">
            <PricingBenefit
              icon={MdFamilyRestroom}
              title={content.familySharing}
            />
            <PricingBenefit icon={MdDevices} title={content.crossPlatform} />
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <PriceCard
            label={content.oneTime.label}
            price={content.oneTime.price}
            badge={content.oneTime.badge}
            description={content.description}
            featured
          />
          <PriceCard
            label={content.subscription.label}
            price={content.subscription.price}
            description={content.crossPlatform}
          />
        </div>

        <details className="group mt-5 overflow-hidden rounded-[28px] [corner-shape:superellipse(1.35)] border border-line bg-panel/55">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-sm font-semibold text-text transition-colors hover:bg-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-text/30 [&::-webkit-details-marker]:hidden">
            <span>
              {content.comparisonLabel}
              <span className="ml-2 font-normal text-muted">
                {content.comparisonDescription}
              </span>
            </span>
            <span
              aria-hidden
              className="text-2xl font-light text-muted transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="border-t border-line px-6 pb-6">
            {content.comparisonItems.map((item) => (
              <div
                key={item.name}
                className="grid gap-1 border-b border-line py-4 last:border-b-0 sm:grid-cols-[1fr_auto]"
              >
                <p className="flex flex-wrap items-center gap-2 font-semibold text-text">
                  {item.name}
                  {item.recommendedLabel ? (
                    <span className="rounded-full bg-blue-400/12 px-2 py-1 text-[10px] uppercase tracking-wider text-blue-300">
                      {item.recommendedLabel}
                    </span>
                  ) : null}
                </p>
                <p className="font-medium text-text sm:text-right">
                  {item.price}
                </p>
                <p className="text-sm leading-6 text-muted sm:col-span-2">
                  {item.description}
                </p>
              </div>
            ))}
            <Button asChild variant="ghost" className="mt-3 px-0">
              <Link href={content.comparisonCtaHref}>
                {content.comparisonCtaLabel}
                <MdOpenInNew data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </details>

        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <Button asChild variant="accent" size="lg">
            <AppStoreLink
              href={site.cta.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              {...analyticsAttrs("app_store_cta_click", {
                placement: ANALYTICS_PLACEMENTS.pricing,
                destination: "mac_app_store",
              })}
            >
              {content.appStoreLabel}
              <MdOpenInNew data-icon="inline-end" />
            </AppStoreLink>
          </Button>
          {content.showSetappBadge ? <SetappBadge /> : null}
        </div>
      </div>
    </section>
  );
}

function PriceCard({
  label,
  price,
  badge,
  description,
  featured = false,
}: {
  label: string;
  price: string;
  badge?: string;
  description: string;
  featured?: boolean;
}) {
  return (
    <Card className={featured ? "border-blue-300/25 bg-blue-400/[0.06]" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardDescription className="font-semibold uppercase tracking-[0.14em]">
            {label}
          </CardDescription>
          {badge ? (
            <span className="rounded-full bg-blue-400/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-300">
              {badge}
            </span>
          ) : null}
        </div>
        <CardTitle className="mt-3 text-4xl tracking-[-0.04em]">
          {price}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted">{description}</p>
        <ul className="mt-6 space-y-3 text-sm text-text">
          <li className="flex items-center gap-2">
            <MdCheck className="size-5 text-green-400" aria-hidden />
            Native apps, no bundled browser
          </li>
          <li className="flex items-center gap-2">
            <MdCheck className="size-5 text-green-400" aria-hidden />
            Direct Google Calendar integration
          </li>
        </ul>
      </CardContent>
      <CardFooter className="sr-only">hora Calendar pricing option</CardFooter>
    </Card>
  );
}

function PricingBenefit({
  icon: Icon,
  title,
}: {
  icon: typeof MdDevices;
  title: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 text-base font-medium text-text sm:justify-start">
      <Icon className="size-6 text-blue-300" aria-hidden />
      <span>{title}</span>
    </div>
  );
}
