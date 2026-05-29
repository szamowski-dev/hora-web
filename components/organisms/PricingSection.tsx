import Link from "next/link";
import Image from "next/image";
import { home } from "@/content/home";

export function PricingSection() {
  const pricing = home.pricing;

  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-y border-white/8 bg-[#0b0c0f] py-20 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 740px 420px at 16% 0%, rgba(255,56,60,0.10), transparent 66%)," +
            "radial-gradient(ellipse 760px 460px at 86% 94%, rgba(131,199,255,0.08), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 20%, black 82%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1180px] px-6">
        <div className="grid gap-6 rounded-lg border border-white/10 bg-white/[0.035] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] md:grid-cols-[0.88fr_1.12fr] md:p-8">
          <div className="flex h-full flex-col">
            <h2
              data-anim="pricing-title"
              className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl"
            >
              {pricing.heading.prefix}{" "}
              <span className="text-accent">{pricing.heading.suffixGradient}</span>
            </h2>
            <p
              data-anim="pricing-copy"
              className="mt-4 max-w-xl text-base leading-7 text-muted md:text-lg md:leading-8"
            >
              {pricing.body}
            </p>
            <p className="mt-3 text-sm font-medium text-muted">
              {pricing.crossPlatform}
            </p>
            <p className="mt-6 rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-muted">
              At launch: <span className="font-semibold text-text">$49.90 one-time</span>{" "}
              or <span className="font-semibold text-text">$29.99/year</span>. Family
              Sharing included.
            </p>
            <Link
              href={pricing.comparisonCta.href}
              className="mt-4 inline-flex h-10 w-fit items-center rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm text-muted transition-colors hover:border-accent/40 hover:bg-white/[0.07] hover:text-text"
            >
              {pricing.comparisonCta.label}
            </Link>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div data-anim="pricing-card" className="rounded-md border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  One-time
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-text">
                  {pricing.oneTime}
                </p>
              </div>
              <div data-anim="pricing-card" className="rounded-md border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Subscription
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-text">
                  {pricing.yearly}
                </p>
              </div>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.02] p-4">
              <div className="mb-3 grid grid-cols-[1fr_auto] border-b border-white/8 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                <p>Alternative</p>
                <p>Price</p>
              </div>
              {pricing.comparison.map((item) => {
                const isHora = item.name.toLowerCase().includes("hora");
                return (
                <div
                  key={item.name}
                  data-anim={isHora ? "pricing-hora" : "pricing-row"}
                  className={`grid grid-cols-1 gap-x-3 gap-y-1 border-b py-3 last:border-b-0 last:pb-0 sm:grid-cols-[1.2fr_auto] sm:py-2 ${
                    isHora
                      ? "rounded-sm border-accent/30 bg-accent/[0.08] px-3 sm:px-2"
                      : "border-white/8"
                  }`}
                >
                  <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-text">
                    <span>{item.name}</span>
                    {isHora ? (
                      <span className="inline-flex rounded-sm border border-accent/35 bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                        Best for Mac
                      </span>
                    ) : null}
                  </p>
                  <p className={`text-sm font-medium sm:text-right ${isHora ? "text-accent" : "text-text"}`}>
                    {item.price}
                  </p>
                  <p className={`text-xs sm:col-span-2 ${isHora ? "text-text/90" : "text-muted"}`}>
                    {item.detail}
                  </p>
                </div>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex h-11 w-fit items-center gap-2 rounded-md border border-accent/40 bg-accent/12 px-4 text-sm font-semibold text-accent"
                aria-label={pricing.appStoreLabel}
              >
                <Image
                  src="/assets/redesign_raw/app-store.svg"
                  alt="Mac App Store icon"
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px]"
                />
                {pricing.appStoreLabel}
              </button>
              <a
                href={pricing.testFlightHref}
                className="inline-flex h-11 w-fit items-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-white shadow-[0_16px_40px_-18px_rgba(255,56,60,0.9),inset_0_1px_0_rgba(255,255,255,0.22)] transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Image
                  src={pricing.testFlightIconSrc}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 rounded-[5px]"
                />
                {pricing.testFlightLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
