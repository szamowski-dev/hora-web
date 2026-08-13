import Image from "next/image";
import Link from "next/link";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { Logo } from "@/components/atoms/Logo";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import {
  DIRECT_DOWNLOAD_HREF,
  DIRECT_DOWNLOAD_LABEL,
} from "@/lib/direct/commerce-contract";
import { MobileNav } from "./MobileNav";

export function Nav({
  activePath,
  showDirectDownload = false,
}: {
  activePath?: string;
  showDirectDownload?: boolean;
}) {
  return (
    <div className="relative mx-auto max-w-6xl">
      <nav className="relative isolate overflow-hidden rounded-[18px] border border-line bg-panel/74 shadow-[inset_0_1px_0_var(--ui-highlight),0_18px_52px_-28px_var(--ui-shadow-neutral)] backdrop-blur-2xl backdrop-saturate-150">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,var(--ui-highlight),transparent_42%,var(--ui-glow-cool-faint))]"
        />
        <div className="relative flex h-14 items-center justify-between px-4 md:h-16 md:px-6">
          <Logo className="min-h-10 shrink-0 md:min-h-12" />
          <div className="hidden items-center gap-5 xl:flex xl:gap-7">
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
                    ? "inline-flex min-h-11 items-center text-sm font-medium text-text focus-visible:outline-none focus-visible:text-accent"
                    : "inline-flex min-h-11 items-center text-sm font-medium text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-accent"
                }
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
            {showDirectDownload ? (
              <Button asChild size="sm">
                <Link
                  href={DIRECT_DOWNLOAD_HREF}
                  {...analyticsAttrs("nav_click", {
                    link_text: DIRECT_DOWNLOAD_LABEL,
                    link_url: DIRECT_DOWNLOAD_HREF,
                  })}
                >
                  {DIRECT_DOWNLOAD_LABEL}
                </Link>
              </Button>
            ) : (
              <AppStoreLink
                href={site.cta.primary.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={site.cta.primary.label}
                className="app-store-interactive inline-flex h-10 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                {...analyticsAttrs("app_store_cta_click", {
                  placement: "nav",
                  destination: "mac_app_store",
                })}
              >
                <Image
                  src={site.macAppStoreBadgeSrc}
                  alt={site.cta.primary.label}
                  width={162}
                  height={50}
                  className="h-10 w-auto"
                />
              </AppStoreLink>
            )}
          </div>
          <ThemeToggle className="mr-10 xl:hidden" />
        </div>
      </nav>
      <MobileNav
        activePath={activePath}
        showDirectDownload={showDirectDownload}
      />
    </div>
  );
}
