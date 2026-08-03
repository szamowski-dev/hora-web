"use client";

import { Purchases, type CustomerInfo } from "@revenuecat/purchases-js";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { MdCheck } from "react-icons/md";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { SetappBadge } from "@/components/atoms/SetappBadge";
import { GoogleSignInButton } from "@/components/billing/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import { site } from "@/content/site";

type PublicBillingConfig = {
  webBillingPublicApiKey: string;
  googleClientId: string;
};

type IdentityResponse = { app_user_id: string };
type PricingPlan = { identifier: "$rc_annual" | "$rc_lifetime"; amount: number; currency: string };
type PurchasePhase = "configuring" | "ready" | "verifying" | "checkout" | "error" | "complete";

const FAQ_ITEMS = [
  {
    question: "Can I try the app for free?",
    answer: "Yes. The Direct app includes a 14-day free trial before its paywall. You do not need a web checkout to start the trial.",
  },
  {
    question: "Is there a one-time purchase option?",
    answer: "Yes. Choose Lifetime to pay once and keep your Direct license. It also unlocks the pro and lifetime entitlements in hora.",
  },
  {
    question: "Can I buy on the App Store?",
    answer: "Yes. hora is available on the Mac App Store with Apple’s own purchase flow and Family Sharing support.",
  },
  {
    question: "Can I share my license with my family?",
    answer: "Family Sharing is available for purchases made through the Mac App Store. Direct licenses are for one person and are not shareable.",
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel an Annual Direct license any time from your Account page. It stays active until the end of the paid period.",
  },
  {
    question: "Do you send a reminder email before renewing?",
    answer: "Paddle sends purchase and renewal emails. We do not currently send a separate renewal reminder, so you can manage your Annual license whenever you need to.",
  },
  {
    question: "What is your refund policy?",
    answer: "If something is not right, contact hello@horacal.app with your order details. We will review the request fairly, and your statutory consumer rights are not affected.",
  },
  {
    question: "What happens after my subscription expires?",
    answer: "Your pro access ends when the Annual period ends. Your calendar data stays in your Google account, and you can subscribe again whenever you are ready.",
  },
] as const;

function activeEntitlements(customerInfo: CustomerInfo | null): string[] {
  return customerInfo ? Object.keys(customerInfo.entitlements.active).sort() : [];
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function formatPrice(plan: PricingPlan) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: plan.currency,
    minimumFractionDigits: plan.identifier === "$rc_lifetime" ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(plan.amount / 100);
}

export function BillingExperience({ mode }: { mode: "pricing" | "account" }) {
  const [config, setConfig] = useState<PublicBillingConfig | null>(null);
  const [appUserId, setAppUserId] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [phase, setPhase] = useState<PurchasePhase>("configuring");
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async (): Promise<PublicBillingConfig> => {
    if (config) return config;
    const response = await fetch("/api/billing/config", { cache: "no-store" });
    const body = (await response.json()) as PublicBillingConfig & { error?: string };
    if (!response.ok) throw new Error(body.error ?? "Sandbox web billing is not configured.");
    setConfig(body);
    return body;
  }, [config]);

  const loadPlans = useCallback(async () => {
    const response = await fetch("/api/billing/plans", { cache: "no-store" });
    const body = (await response.json()) as { plans?: PricingPlan[]; error?: string };
    if (!response.ok || !body.plans) throw new Error(body.error ?? "Sandbox plans are unavailable.");
    if (body.plans.length !== 2) throw new Error("The sandbox offering must contain exactly Annual and Lifetime.");
    setPlans(body.plans.sort((a, b) => a.identifier.localeCompare(b.identifier)));
  }, []);

  useEffect(() => {
    if (mode !== "pricing") return;
    void loadPlans().catch((caughtError) => setError(errorMessage(caughtError)));
  }, [loadPlans, mode]);

  const closePurchaseDialog = useCallback(() => {
    if (phase === "checkout") return;
    setSelectedPlan(null);
    setError(null);
    setPhase("ready");
  }, [phase]);

  const choosePlan = useCallback(async (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setError(null);
    setPhase("configuring");
    try {
      await loadConfig();
      setPhase("ready");
    } catch (caughtError) {
      setError(errorMessage(caughtError));
      setPhase("error");
    }
  }, [loadConfig]);

  const handleCredential = useCallback(async (idToken: string) => {
    if (!selectedPlan && mode !== "account") return;
    setError(null);
    setPhase("verifying");
    try {
      const billingConfig = await loadConfig();
      const tokenParts = idToken.split(".");
      const payload = tokenParts[1]
        ? JSON.parse(atob(tokenParts[1].replace(/-/g, "+").replace(/_/g, "/"))) as { sub?: string }
        : null;
      if (!payload?.sub) throw new Error("Google did not return a valid identity.");

      const identityResponse = await fetch("/api/billing/identity", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ google_subject: payload.sub }),
      });
      const identity = (await identityResponse.json()) as IdentityResponse & { error?: string };
      if (!identityResponse.ok || !identity.app_user_id) {
        throw new Error(identity.error ?? "Unable to verify your Google sign-in.");
      }

      let purchases: ReturnType<typeof Purchases.configure>;
      if (Purchases.isConfigured()) {
        purchases = Purchases.getSharedInstance();
        await purchases.changeUser(identity.app_user_id);
      } else {
        purchases = Purchases.configure({
          apiKey: billingConfig.webBillingPublicApiKey,
          appUserId: identity.app_user_id,
        });
      }

      setAppUserId(identity.app_user_id);
      setCustomerInfo(await purchases.getCustomerInfo());
      if (!selectedPlan) {
        setPhase("ready");
        return;
      }
      const offerings = await purchases.getOfferings();
      if (offerings.current?.identifier !== "pro") {
        throw new Error("The Direct checkout is temporarily unavailable. Please try again shortly.");
      }
      const selectedPackage = offerings.current.availablePackages.find((pkg) => pkg.identifier === selectedPlan.identifier);
      if (!selectedPackage) throw new Error("The selected plan is temporarily unavailable. Please try again shortly.");

      // RevenueCat mounts Paddle's checkout at the document root. Close our
      // sign-in dialog first so it cannot remain above the payment controls.
      setSelectedPlan(null);
      setPhase("checkout");
      const result = await purchases.purchase({ rcPackage: selectedPackage });
      setCustomerInfo(await purchases.getCustomerInfo());
      if (!Object.keys(result.customerInfo.entitlements.active).length) {
        throw new Error("Your purchase was completed, but access is still being confirmed. Please refresh your Account page in a moment.");
      }
      setPhase("complete");
    } catch (caughtError) {
      setError(errorMessage(caughtError));
      setPhase("error");
    }
  }, [loadConfig, mode, selectedPlan]);

  if (mode === "account") {
    const entitlementNames = activeEntitlements(customerInfo);
    return (
      <section className="px-5 pb-28 pt-12 sm:px-10 sm:pb-40">
        <div className="mx-auto max-w-2xl rounded-[28px] border border-line bg-panel/55 p-6 shadow-[0_24px_70px_-42px_var(--ui-shadow-neutral)] sm:p-10">
          {!appUserId ? (
            <>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-text">Your purchases</h1>
              <p className="mt-3 max-w-lg text-base leading-7 text-muted">Sign in with Google to see your Direct entitlements and manage an Annual license.</p>
              {!config ? <Button className="mt-7" onClick={() => void loadConfig().then(() => setPhase("ready")).catch((caughtError) => setError(errorMessage(caughtError)))}>Continue with Google</Button> : null}
              {config ? <div className="mt-7"><GoogleSignInButton clientId={config.googleClientId} onCredential={(credential) => void handleCredential(credential)} /></div> : null}
              {error ? <p role="alert" className="mt-5 text-sm text-accent">{error}</p> : null}
            </>
          ) : (
            <>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-text">Your purchases</h1>
              {entitlementNames.length ? <ul className="mt-6 flex flex-wrap gap-2">{entitlementNames.map((name) => <li key={name} className="rounded-full bg-success/15 px-3 py-1.5 text-sm font-semibold text-text">{name}</li>)}</ul> : <p className="mt-4 text-muted">No active entitlement yet.</p>}
              {customerInfo?.managementURL ? <Button asChild variant="outline" className="mt-7"><a href={customerInfo.managementURL}>Manage Annual license</a></Button> : null}
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="px-5 pb-20 pt-5 sm:px-10 sm:pb-28 sm:pt-10">
        <div className="mx-auto max-w-4xl">
          <p className="mx-auto max-w-2xl text-center text-base leading-7 text-muted sm:text-lg">Try hora free for 14 days in the native app. Choose how you would like to continue once the trial ends.</p>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {plans.map((plan) => {
              const annual = plan.identifier === "$rc_annual";
              return (
                <article key={plan.identifier} className="flex min-h-[330px] flex-col rounded-[28px] border border-line bg-panel/55 p-6 shadow-[0_20px_56px_-42px_var(--ui-shadow-neutral)] sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">{annual ? "Annual" : "Lifetime"}</p>
                  <p className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-text">{formatPrice(plan)}<span className="ml-1 text-xl tracking-[-0.03em] text-muted">{annual ? "/year" : ""}</span></p>
                  <p className="mt-4 text-sm leading-6 text-muted">{annual ? "A lower upfront price, renewed yearly. No web trial." : "One payment for ongoing Direct access."}</p>
                  <ul className="mt-7 space-y-3 text-sm text-text">
                    <li className="flex items-center gap-2"><MdCheck className="size-5 text-success" aria-hidden />Native Mac app</li>
                    <li className="flex items-center gap-2"><MdCheck className="size-5 text-success" aria-hidden />Google Calendar, built in</li>
                    <li className="flex items-center gap-2"><MdCheck className="size-5 text-success" aria-hidden />{annual ? "Cancel any time" : "No renewal"}</li>
                  </ul>
                  <Button className="mt-10 w-full" size="lg" variant={annual ? "outline" : "accent"} disabled={!plans.length} onClick={() => void choosePlan(plan)}>
                    Choose {annual ? "Annual" : "Lifetime"}
                  </Button>
                </article>
              );
            })}
          </div>
          {error && !selectedPlan ? <p role="alert" className="mt-5 text-center text-sm text-accent">{error}</p> : null}
        </div>
      </section>

      <div aria-hidden="true" className="mx-auto h-px max-w-16 bg-text/15 sm:max-w-24" />

      <section className="px-5 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-text">Other ways to get hora</h2>
            <p className="mt-3 text-base leading-7 text-muted">Prefer Apple’s purchase flow or already have Setapp? Both options are available for the Mac app.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="flex min-h-60 flex-col rounded-[28px] border border-line bg-panel/55 p-6 sm:p-8">
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-text">Mac App Store</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-muted">Purchase through Apple and use Family Sharing across eligible family members.</p>
              <AppStoreLink href={site.cta.primary.href} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex w-fit" {...analyticsAttrs("app_store_cta_click", { placement: ANALYTICS_PLACEMENTS.pricing, destination: "mac_app_store" })}>
                <Image src="/assets/brand/mac-app-store-badge.svg" alt="Download on the Mac App Store" width={156} height={40} />
              </AppStoreLink>
            </article>
            <article className="flex min-h-60 flex-col rounded-[28px] border border-line bg-panel/55 p-6 sm:p-8">
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-text">Setapp</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-muted">hora is included with your Setapp subscription on Mac. No separate purchase is needed.</p>
              <div className="mt-auto pt-6"><SetappBadge /></div>
            </article>
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="mx-auto h-px max-w-16 bg-text/15 sm:max-w-24" />

      <section className="px-5 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-text">Frequently asked questions</h2>
          <div className="mt-8 divide-y divide-line overflow-hidden rounded-[28px] border border-line bg-panel/55">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="group px-6">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-semibold text-text [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span aria-hidden className="text-2xl font-light text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-2xl pb-6 text-sm leading-6 text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={selectedPlan !== null} onOpenChange={(open) => { if (!open) closePurchaseDialog(); }}>
        <DialogContent className="max-w-[calc(100%-2rem)] gap-0 p-6 sm:max-w-md sm:p-8" showCloseButton={phase !== "checkout"}>
          {selectedPlan ? (
            <>
              <DialogHeader className="pr-10 text-left">
                <DialogTitle className="text-3xl tracking-[-0.05em]">Continue with Google</DialogTitle>
                <DialogDescription className="mt-3 text-base leading-7 text-muted">Sign in to attach this purchase to your hora account. Your Google token is never stored in the browser.</DialogDescription>
              </DialogHeader>
              <div className="mt-7 rounded-2xl border border-line bg-overlay px-5 py-4">
                <div className="flex items-baseline justify-between gap-4"><span className="font-semibold text-text">{selectedPlan.identifier === "$rc_annual" ? "Annual" : "Lifetime"}</span><span className="text-lg font-semibold text-text">{formatPrice(selectedPlan)}{selectedPlan.identifier === "$rc_annual" ? "/year" : ""}</span></div>
                <p className="mt-2 text-sm text-muted">{selectedPlan.identifier === "$rc_annual" ? "Renews yearly. Cancel any time." : "One payment. No renewal."}</p>
              </div>
              <div className="mt-7 min-h-11">
                {phase === "configuring" ? <p className="text-sm text-muted">Preparing secure sign-in…</p> : null}
                {phase === "verifying" ? <p className="text-sm text-muted">Verifying your Google account…</p> : null}
                {phase === "checkout" ? <p className="text-sm text-muted">Opening secure checkout…</p> : null}
                {phase === "ready" && config ? <GoogleSignInButton clientId={config.googleClientId} onCredential={(credential) => void handleCredential(credential)} /> : null}
                {phase === "error" ? <div><p role="alert" className="text-sm leading-6 text-accent">{error}</p><Button className="mt-5" variant="outline" onClick={() => selectedPlan && void choosePlan(selectedPlan)}>Try again</Button></div> : null}
                {phase === "complete" ? <div><p className="text-sm leading-6 text-success">Purchase complete. Your entitlement is active.</p><Button className="mt-5" onClick={closePurchaseDialog}>Done</Button></div> : null}
              </div>
              <p className="mt-7 text-xs leading-5 text-muted">By continuing, you agree to the <Link className="underline underline-offset-4 hover:text-text" href="/terms/">Terms</Link> and <Link className="underline underline-offset-4 hover:text-text" href="/privacy/">Privacy Policy</Link>.</p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
