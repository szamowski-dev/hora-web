import { MdCheck, MdDownloadForOffline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PLACEMENTS,
  type AnalyticsPlacement,
} from "@/lib/analyticsSchema";
import { DIRECT_DOWNLOAD_HREF } from "@/lib/direct/commerce-contract";
import { cn } from "@/lib/cn";
import type { PricingPlan } from "@/lib/pricing-model";

/**
 * The plan cards shown on /pricing/, extracted so conversion pages can render
 * the same commercial terms instead of paraphrasing them.
 */
export function PricingPlans({
  plans,
  showDirectDownload,
  placement = ANALYTICS_PLACEMENTS.pricing,
  className,
}: {
  plans: PricingPlan[];
  showDirectDownload: boolean;
  placement?: AnalyticsPlacement;
  className?: string;
}) {
  return (
    <section
      aria-label="Plans"
      className={cn("mx-auto grid max-w-[960px] gap-5 md:grid-cols-2", className)}
    >
      {plans.map((plan) => (
        <article
          key={`${plan.name}-${plan.price}`}
          className={cn(
            "relative flex min-h-[30rem] flex-col rounded-[28px] border bg-panel/35 p-7 shadow-[0_24px_70px_-42px_var(--ui-shadow-neutral)] sm:p-9",
            plan.featured ? "border-success/65" : "border-line",
          )}
        >
          {plan.featured && plan.featuredLabel ? (
            <span className="absolute right-5 top-0 -translate-y-1/2 rounded-md bg-success px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_10px_26px_-14px_var(--color-success)]">
              {plan.featuredLabel}
            </span>
          ) : null}
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
              {plan.name}
            </p>
            {plan.savingsLabel ? (
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-success">
                {plan.savingsLabel}
              </span>
            ) : null}
          </div>
          <div className="mt-5 flex items-baseline gap-2">
            <p className="text-5xl font-semibold tracking-[-0.07em] text-text sm:text-6xl">
              {plan.price}
            </p>
            {plan.suffix ? (
              <span className="text-base font-medium tracking-normal text-muted sm:text-lg">
                {plan.suffix}
              </span>
            ) : null}
          </div>
          {plan.priceDetail ? (
            <p className="mt-2 text-lg font-semibold text-success">
              {plan.priceDetail}
            </p>
          ) : null}
          <p className="mt-2 text-base leading-7 text-muted">
            {plan.billingLabel}
          </p>
          <div className="mt-8 border-t border-line" />
          <ul className="mt-7 space-y-4 text-base text-text">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <MdCheck className="size-5 shrink-0 text-success" aria-hidden />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <Button asChild size="lg" className="w-full rounded-xl">
              <a
                href={
                  showDirectDownload
                    ? DIRECT_DOWNLOAD_HREF
                    : site.cta.primary.href
                }
                {...(showDirectDownload
                  ? analyticsAttrs(ANALYTICS_EVENTS.directDownloadClick, {
                      placement,
                      destination: "direct_download",
                    })
                  : analyticsAttrs("app_store_cta_click", {
                      placement,
                      destination: "mac_app_store",
                    }))}
                {...(!showDirectDownload
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <MdDownloadForOffline data-icon="inline-start" aria-hidden />
                {plan.ctaLabel}
              </a>
            </Button>
            <p className="mt-3 text-center text-base leading-6 text-muted">
              {plan.ctaHelper}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
