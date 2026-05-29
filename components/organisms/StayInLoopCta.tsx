import { WaitlistCard } from "@/components/molecules/WaitlistCard";
import { blog } from "@/content/blog";
import { home } from "@/content/home";
import { getTestFlightTesterCount } from "@/lib/testflight";

export async function StayInLoopCta() {
  const cta = blog.footerCta;
  const socialProof = home.hero.newsletter.socialProof;
  const liveCount = await getTestFlightTesterCount(socialProof.count);

  return (
    <section className="relative overflow-hidden border-y border-white/8 bg-[#0b0c0f] py-20 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 700px 400px at 15% 0%, rgba(255,56,60,0.10), transparent 64%)," +
            "radial-gradient(ellipse 760px 460px at 85% 100%, rgba(131,199,255,0.08), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 20%, black 82%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1180px] px-6">
        <div className="text-center">
          <span className="inline-flex items-center rounded-md border border-accent/35 bg-accent/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            {cta.eyebrow}
          </span>
          <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
            {cta.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
            {cta.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-[780px] md:mt-12">
          <WaitlistCard
            placement="stay_in_loop"
            headline={cta.cardHeadline}
            subheadline={cta.cardSubheadline}
            liveCount={liveCount}
            socialLabel="Mac users are already testing hora on TestFlight"
            avatars={socialProof.avatars}
            variant="hero"
          />
        </div>
      </div>
    </section>
  );
}
