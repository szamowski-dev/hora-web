import { WaitlistCard } from "@/components/molecules/WaitlistCard";
import { Icon } from "@/components/atoms/Icon";
import { home } from "@/content/home";
import { getTestFlightTesterCount } from "@/lib/testflight";

const benefits = [
  {
    icon: "rocket" as const,
    title: "Early access",
    body: "Be first to try every update.",
  },
  {
    icon: "like" as const,
    title: "Shape the product",
    body: "Your feedback drives the roadmap.",
  },
  {
    icon: "party-popper" as const,
    title: "Founding benefits",
    body: "Special pricing for early supporters.",
  },
];

export async function BetaCta() {
  const cta = home.betaCta;
  const socialProof = home.hero.newsletter.socialProof;
  const liveCount = await getTestFlightTesterCount(socialProof.count);

  return (
    <section className="relative overflow-hidden py-20 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_420px_at_22%_16%,rgba(255,56,60,0.16),transparent_68%),radial-gradient(720px_420px_at_80%_70%,rgba(131,199,255,0.08),transparent_72%)]"
      />

      <div className="relative mx-auto max-w-[1180px] px-6">
        <div className="grid gap-8 rounded-lg border border-white/10 bg-white/[0.035] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_34px_90px_-60px_rgba(255,56,60,0.8)] md:grid-cols-[0.95fr_1.05fr] md:p-10 lg:p-11">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                {cta.eyebrow}
              </p>
              <h2 className="mt-5 max-w-[16ch] text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
                Join {liveCount.toLocaleString()}+ Mac users building the future
                of <span className="text-accent">Google Calendar on Mac.</span>
              </h2>
            </div>

            <div className="mt-8 grid gap-2.5 sm:grid-cols-3">
              {benefits.map((item) => (
                <div
                  key={item.title}
                  className="rounded-md border border-white/10 bg-white/[0.02] p-3"
                >
                  <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-md border border-accent/25 bg-accent/10 text-accent">
                    <Icon name={item.icon} size={16} />
                  </div>
                  <h3 className="text-sm font-semibold leading-tight text-text">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-[1.35rem] text-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <WaitlistCard
            id="newsletter"
            placement="beta_cta"
            headline={cta.cardHeadline}
            subheadline={cta.cardSubheadline}
            liveCount={liveCount}
            socialLabel={socialProof.label}
            avatars={socialProof.avatars}
            variant="hero"
            className="h-fit self-center"
          />
        </div>
      </div>
    </section>
  );
}
