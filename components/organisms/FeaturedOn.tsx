import { home } from "@/content/home";
import { cn } from "@/lib/cn";

export function FeaturedOn() {
  const f = home.featuredOn;

  return (
    <section
      aria-label={f.label}
      className="relative overflow-hidden border-b border-white/8 bg-[#0d0e11] py-10 md:py-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/18 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative mx-auto max-w-[1180px] px-6">
        <div className="grid gap-5 md:grid-cols-[7.5rem_minmax(0,1fr)] md:items-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted/80 md:whitespace-nowrap">
            {f.label}
          </span>
          <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {f.badges.map((badge) => (
              <li key={badge.href} data-anim="featured-badge" className="min-w-0">
                <a
                  href={badge.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-full items-center justify-center rounded-md opacity-75 grayscale transition-[opacity,filter] hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black md:h-14"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={badge.src}
                    alt={badge.alt}
                    width={badge.width}
                    height={badge.height}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "block max-h-10 max-w-full object-contain md:max-h-11",
                      "className" in badge ? badge.className : undefined,
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
