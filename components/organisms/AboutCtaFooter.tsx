import Link from "next/link";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";

export function AboutCtaFooter() {
  return (
    <section className="mx-auto max-w-295 px-6 pb-20 md:pb-28">
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={site.cta.primary.href}
          target="_blank"
          rel="noopener noreferrer"
          {...analyticsAttrs("app_store_cta_click", {
            placement: "about_page",
            destination: "mac_app_store",
          })}
          className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-accent/30 bg-linear-to-br from-accent/16 to-accent/6 px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-[0_28px_60px_-20px_rgba(255,56,60,0.4)]"
        >
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              Now on the Mac App Store
            </span>
            <span className="mt-1 block text-base font-semibold text-text md:text-lg">
              Download hora Calendar for Mac
            </span>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>

        <Link
          href="/blog/"
          className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/4 px-6 py-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-white/6"
        >
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Building in public
            </span>
            <span className="mt-1 block text-base font-semibold text-text md:text-lg">
              Read the dev blog
            </span>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
            aria-hidden
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
