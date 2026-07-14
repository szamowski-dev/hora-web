import Link from "next/link";
import Image from "next/image";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { Logo } from "@/components/atoms/Logo";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import { MobileNav } from "./MobileNav";

export function Nav({ activePath }: { activePath?: string }) {
  return (
    <div className="relative mx-auto max-w-295">
      <nav className="relative isolate overflow-hidden rounded-[20px] border border-line bg-panel/88 shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.07),0_16px_42px_-24px_oklch(0_0_0/0.9),0_10px_36px_-30px_oklch(0.4269_0.1069_255.7/0.55)] backdrop-blur-2xl backdrop-saturate-150 md:rounded-[22px] md:bg-panel/76 md:shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.07),0_18px_52px_-24px_oklch(0_0_0/0.88),0_12px_46px_-32px_oklch(0.4269_0.1069_255.7/0.6)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,oklch(0.9851_0_0/0.065)_0%,oklch(0.9851_0_0/0.015)_38%,oklch(0.4269_0.1069_255.7/0.055)_70%,oklch(0.6532_0.2328_25.7/0.04)_100%)]"
        />
        <div className="relative mx-auto flex h-14 max-w-295 items-center justify-between px-4 md:h-16 md:px-6">
          <Logo className="min-h-10 shrink-0 md:min-h-12" />
          <div className="hidden min-w-0 items-center gap-5 lg:flex">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                {...analyticsAttrs("nav_click", {
                  link_text: item.label,
                  link_url: item.href,
                })}
                className={
                  activePath === item.href
                    ? "inline-flex min-h-12 shrink-0 items-center text-sm text-text transition-colors focus-visible:outline-none focus-visible:text-accent"
                    : "inline-flex min-h-12 shrink-0 items-center text-sm text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-accent"
                }
              >
                {item.label}
              </Link>
            ))}
            <AppStoreLink
              href={site.cta.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={site.cta.primary.label}
              {...analyticsAttrs("app_store_cta_click", {
                placement: ANALYTICS_PLACEMENTS.nav,
                destination: "mac_app_store",
              })}
              className="app-store-interactive inline-flex h-10 shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Image
                src={site.macAppStoreBadgeSrc}
                alt={site.cta.primary.label}
                width={162}
                height={50}
                className="h-10 w-auto"
              />
            </AppStoreLink>
          </div>
        </div>
      </nav>
      <MobileNav activePath={activePath} />
    </div>
  );
}
