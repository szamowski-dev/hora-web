import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { MobileNav } from "./MobileNav";

export function Nav({
  activePath,
  showDownload = false,
  downloadLabel = site.cta.trial.label,
}: {
  activePath?: string;
  showDownload?: boolean;
  downloadLabel?: string;
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
          <div className="hidden items-center gap-5 md:flex lg:gap-7">
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
            {showDownload ? (
              <Button asChild size="sm">
                <Link
                  href={site.cta.trial.href}
                  {...analyticsAttrs("nav_click", {
                    link_text: downloadLabel,
                    link_url: site.cta.trial.href,
                  })}
                >
                  {downloadLabel}
                </Link>
              </Button>
            ) : null}
          </div>
          <ThemeToggle className="mr-10 md:hidden" />
        </div>
      </nav>
      <MobileNav
        activePath={activePath}
        showDownload={showDownload}
        downloadLabel={downloadLabel}
      />
    </div>
  );
}
