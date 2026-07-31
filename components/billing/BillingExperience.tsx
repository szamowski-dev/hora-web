"use client";

import { Purchases, type CustomerInfo, type Package } from "@revenuecat/purchases-js";
import { useCallback, useState } from "react";
import { GoogleSignInButton } from "@/components/billing/GoogleSignInButton";
import { Button } from "@/components/ui/button";

type PublicBillingConfig = {
  webBillingPublicApiKey: string;
  googleClientId: string;
};

type IdentityResponse = { app_user_id: string };

function activeEntitlements(customerInfo: CustomerInfo | null): string[] {
  return customerInfo ? Object.keys(customerInfo.entitlements.active).sort() : [];
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export function BillingExperience({ mode }: { mode: "pricing" | "account" }) {
  const [config, setConfig] = useState<PublicBillingConfig | null>(null);
  const [appUserId, setAppUserId] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [status, setStatus] = useState("Preparing secure sign-in…");
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const loadConfig = useCallback(async (): Promise<PublicBillingConfig> => {
    if (config) return config;
    const response = await fetch("/api/billing/config", { cache: "no-store" });
    const body = (await response.json()) as PublicBillingConfig & { error?: string };
    if (!response.ok) throw new Error(body.error ?? "Sandbox web billing is not configured.");
    setConfig(body);
    return body;
  }, [config]);

  const handleCredential = useCallback(
    async (idToken: string) => {
      setError(null);
      setStatus("Verifying Google sign-in…");
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

        const purchases = Purchases.isConfigured()
          ? Purchases.getSharedInstance()
          : Purchases.configure({
              apiKey: billingConfig.webBillingPublicApiKey,
              appUserId: identity.app_user_id,
            });
        if (Purchases.isConfigured()) {
          await purchases.changeUser(identity.app_user_id);
        }

        const freshCustomerInfo = await purchases.getCustomerInfo();
        setAppUserId(identity.app_user_id);
        setCustomerInfo(freshCustomerInfo);

        if (mode === "pricing") {
          const offerings = await purchases.getOfferings();
          if (offerings.current?.identifier !== "pro") {
            throw new Error("The sandbox offering is unavailable. Check the RevenueCat web configuration.");
          }
          const expectedPackages = offerings.current.availablePackages.filter(
            (pkg) => pkg.identifier === "$rc_annual" || pkg.identifier === "$rc_lifetime",
          );
          if (expectedPackages.length !== 2) {
            throw new Error("The sandbox offering must contain exactly Annual and Lifetime.");
          }
          setPackages(expectedPackages.sort((a, b) => a.identifier.localeCompare(b.identifier)));
        }
        setStatus("Signed in securely.");
      } catch (caughtError) {
        setError(errorMessage(caughtError));
        setStatus("Sign-in could not be completed.");
      }
    },
    [loadConfig, mode],
  );

  const start = useCallback(async () => {
    setError(null);
    try {
      await loadConfig();
      setStatus("Continue with Google to see your sandbox billing.");
    } catch (caughtError) {
      setError(errorMessage(caughtError));
      setStatus("Sandbox billing is unavailable.");
    }
  }, [loadConfig]);

  const purchase = useCallback(async (pkg: Package) => {
    setPurchasing(pkg.identifier);
    setError(null);
    try {
      const purchases = Purchases.getSharedInstance();
      const result = await purchases.purchase({ rcPackage: pkg });
      setCustomerInfo(await purchases.getCustomerInfo());
      setStatus(
        Object.keys(result.customerInfo.entitlements.active).length
          ? "Purchase complete. Your entitlement is active."
          : "Purchase completed. Refreshing entitlement status…",
      );
    } catch (caughtError) {
      setError(errorMessage(caughtError));
    } finally {
      setPurchasing(null);
    }
  }, []);

  const entitlementNames = activeEntitlements(customerInfo);

  return (
    <section className="px-5 pb-28 pt-12 sm:px-10 sm:pb-40">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-line bg-panel/55 p-6 shadow-[0_24px_70px_-42px_var(--ui-shadow-neutral)] sm:p-10">
        <p className="text-sm leading-6 text-muted">{status}</p>
        {error ? <p role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}

        {!config ? <Button className="mt-6" onClick={() => void start()}>Continue with Google</Button> : null}
        {config && !appUserId ? <div className="mt-6"><GoogleSignInButton clientId={config.googleClientId} onCredential={(credential) => void handleCredential(credential)} /></div> : null}

        {appUserId && mode === "pricing" ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {packages.map((pkg) => {
              const annual = pkg.identifier === "$rc_annual";
              return (
                <article key={pkg.identifier} className="rounded-2xl border border-line bg-overlay p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">{annual ? "Annual" : "Lifetime"}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-text">{annual ? "$29.99/year" : "$49"}</p>
                  <p className="mt-3 text-sm leading-6 text-muted">{annual ? "Renews yearly. No web trial." : "Pay once and keep access."}</p>
                  <Button className="mt-6 w-full" variant={annual ? "outline" : "accent"} disabled={purchasing !== null} onClick={() => void purchase(pkg)}>
                    {purchasing === pkg.identifier ? "Opening checkout…" : `Choose ${annual ? "Annual" : "Lifetime"}`}
                  </Button>
                </article>
              );
            })}
          </div>
        ) : null}

        {appUserId && mode === "account" ? (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-text">Your active entitlements</h2>
            {entitlementNames.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">{entitlementNames.map((name) => <li key={name} className="rounded-full bg-accent/15 px-3 py-1.5 text-sm font-semibold text-text">{name}</li>)}</ul>
            ) : <p className="mt-3 text-sm text-muted">No active entitlement yet.</p>}
            {customerInfo?.managementURL ? <Button asChild variant="outline" className="mt-6"><a href={customerInfo.managementURL}>Manage purchase</a></Button> : null}
          </div>
        ) : null}

        {appUserId && mode === "pricing" && entitlementNames.length ? <p className="mt-6 text-sm font-medium text-green-300">Active: {entitlementNames.join(", ")}</p> : null}
      </div>
    </section>
  );
}
