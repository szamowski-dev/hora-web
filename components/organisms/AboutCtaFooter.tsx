import Link from "next/link";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { Icon } from "@/components/atoms/Icon";
import { SectionBackdrop } from "@/components/atoms/SectionBackdrop";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";

export function AboutCtaFooter() {
  return (
    <section className="home-section relative overflow-hidden border-y py-16 md:py-20">
      <SectionBackdrop direction="left" />

      <div className="relative mx-auto max-w-295 px-6">
        <div className="shader-panel ui-panel grid gap-8 overflow-hidden rounded-xl p-6 md:grid-cols-[1.15fr_0.85fr] md:items-center md:p-9 lg:p-10">
          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent">
              Try hora Calendar
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-text md:text-4xl">
              Your calendar should feel at home on your Mac.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted md:text-base md:leading-7">
              Download hora from the Mac App Store or follow the dev blog to see
              what is being built next.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
            <AppStoreLink
              href={site.cta.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              {...analyticsAttrs("app_store_cta_click", {
                placement: "about_page",
                destination: "mac_app_store",
              })}
              className="flex min-h-14 items-center justify-between rounded-lg border border-accent/40 bg-accent px-5 py-4 font-semibold text-text transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text"
            >
              <span>Download for Mac</span>
              <Icon name="arrow-right" size={18} />
            </AppStoreLink>

            <Link
              href="/blog/"
              className="ui-interactive ui-panel-soft flex min-h-14 items-center justify-between rounded-lg px-5 py-4 font-semibold text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>Read the dev blog</span>
              <Icon name="arrow-right" size={18} className="text-accent" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
