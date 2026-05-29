import { Icon } from "@/components/atoms/Icon";
import { home } from "@/content/home";
import { getTestFlightTesterCount } from "@/lib/testflight";

export async function UserProof() {
  const proof = home.userProof;
  const testFlightProof = home.hero.newsletter.socialProof;
  const liveCount = await getTestFlightTesterCount(testFlightProof.count);

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

      <div className="relative mx-auto max-w-[1180px] px-6">
        <div className="max-w-5xl">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
            Already in <span className="text-accent">real Mac calendars.</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:mt-14 md:grid-cols-[0.72fr_1.28fr] md:items-stretch">
          <div className="relative flex min-h-[15rem] flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_28px_80px_-58px_rgba(255,56,60,0.7)]">
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

          <figure className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] px-7 py-8 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] md:px-9 md:py-8">
            <span
              aria-hidden
              className="pointer-events-none absolute left-7 top-5 text-5xl font-semibold leading-none text-accent md:left-9"
            >
              &ldquo;
            </span>

            <blockquote className="relative max-w-2xl pt-8 text-balance text-2xl font-semibold leading-tight tracking-tight text-text/95 md:text-4xl md:leading-[1.14]">
              {proof.quote.text}
            </blockquote>

            <figcaption className="relative mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proof.quote.avatarSrc}
                alt={`${proof.quote.author} avatar`}
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                className="h-12 w-12 rounded-full border border-white/15 bg-white/5 object-cover"
              />
              <div className="leading-tight">
                <p className="text-base font-semibold text-text">
                  {proof.quote.author}
                </p>
                <a
                  href={proof.quote.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${proof.quote.author} on X`}
                  className="mt-1 inline-flex min-h-12 items-center gap-1.5 text-sm text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-accent"
                >
                  <Icon name="x" size={13} />
                  {proof.quote.handle}
                </a>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
