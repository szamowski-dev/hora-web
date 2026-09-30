import { MdCheck } from "react-icons/md";
import { cn } from "@/lib/cn";
import type { PricingPlan } from "@/lib/pricing-model";

/**
 * The plan cards shown on /pricing/, extracted so conversion pages can render
 * the same commercial terms instead of paraphrasing them.
 */
export function PricingPlans({
  plans,
  showDirectDownload,
  className,
}: {
  plans: PricingPlan[];
  showDirectDownload: boolean;
  className?: string;
}) {
  const visiblePlans = plans.filter((plan) => !plan.directOnly || showDirectDownload);

  return (
    <section
      aria-label="Plans"
      className={cn("mx-auto grid gap-5 md:grid-cols-2", visiblePlans.length > 2 ? "max-w-landing lg:grid-cols-3" : "max-w-[960px]", className)}
    >
      {visiblePlans.map((plan) => (
        <article
          key={`${plan.name}-${plan.price}`}
          className={cn(
            "relative flex min-h-[27rem] flex-col rounded-[28px] border bg-panel/35 p-7 shadow-[0_24px_70px_-42px_var(--ui-shadow-neutral)] sm:p-8",
            plan.directOnly ? "border-2 border-accent" : plan.featured ? "border-success/65" : "border-line",
          )}
        >
          <div className="flex min-h-7 items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
              {plan.name}
            </p>
            {plan.directOnly ? (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white">
                {plan.featuredLabel || "Direct only"}
              </span>
            ) : plan.savingsLabel ? (
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-success">
                {plan.savingsLabel}
              </span>
            ) : null}
          </div>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <p className="text-5xl font-semibold tracking-[-0.07em] text-text xl:text-6xl">
              {plan.price}
            </p>
            {plan.suffix ? (
              <span className="text-base font-medium tracking-normal text-muted">
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
          <ul className="mt-auto space-y-4 border-t border-line pt-7 text-sm text-text">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <MdCheck className={cn("size-5 shrink-0", plan.directOnly ? "text-accent" : "text-success")} aria-hidden />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
