import { Icon } from "@/components/atoms/Icon";
import { home } from "@/content/home";
import { getTestFlightTesterCount } from "@/lib/testflight";

export async function UserProof() {
  const proof = home.userProof;
  const testFlightProof = home.hero.newsletter.socialProof;
  const liveCount = await getTestFlightTesterCount(testFlightProof.count);
  const quoteTextClass = (text: string) =>
    text.length > 120
      ? "text-[0.8rem] leading-[1.24] md:text-[0.84rem] md:leading-[1.26]"
      : "text-[1.18rem] leading-[1.18] md:text-[1.28rem] md:leading-[1.2]";

  return (
    <section className="relative overflow-hidden border-y border-white/8 bg-[#0b0c0f] py-20 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_420px_at_18%_10%,rgba(255,56,60,0.10),transparent_70%),radial-gradient(760px_460px_at_86%_82%,rgba(131,199,255,0.07),transparent_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 20%, black 82%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-295 px-6">
        <div className="max-w-5xl">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
            Already in <span className="text-accent">real Mac calendars.</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:mt-14 md:grid-cols-[0.72fr_1.28fr] md:items-start">
          <div className="relative flex min-h-[13.5rem] flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_28px_80px_-58px_rgba(255,56,60,0.7)] md:h-[14.5rem]">
            <div className="flex items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-accent/25 bg-accent/10 text-accent">
                <Icon name="users" size={22} />
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-6xl font-semibold leading-none tracking-tight text-accent md:text-7xl">
                {liveCount.toLocaleString()}+
              </p>
              <p className="mt-4 max-w-sm text-balance text-base font-semibold leading-snug text-text md:text-lg">
                {testFlightProof.label}
              </p>
            </div>
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-2">
            {proof.quotes.map((quote) => (
              <figure
                key={quote.href}
                className="relative flex min-h-[13.5rem] flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] px-5 py-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] md:h-[14.5rem] md:px-6 md:py-6"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-5 top-4 text-3xl font-semibold leading-none text-accent md:left-6"
                >
                  &ldquo;
                </span>

                <div className="relative flex h-[7.1rem] items-center pt-5">
                  <blockquote
                    className={`max-w-xl text-pretty font-semibold tracking-tight text-text/95 ${quoteTextClass(
                      quote.text,
                    )}`}
                  >
                    {quote.text}
                  </blockquote>
                </div>

                <figcaption className="relative mt-auto flex items-center gap-2.5 border-t border-white/10 pt-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={quote.avatarSrc}
                    alt={`${quote.author} avatar`}
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className="h-9 w-9 rounded-full border border-white/15 bg-white/5 object-cover"
                  />
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-text">
                      {quote.author}
                    </p>
                    <a
                      href={quote.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${quote.author} on X`}
                      className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-accent"
                    >
                      <Icon name="x" size={12} />
                      {quote.handle}
                    </a>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
