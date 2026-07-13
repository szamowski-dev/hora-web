import { NewsletterForm } from "@/components/molecules/NewsletterForm";
import { WaitlistImpression } from "@/components/molecules/WaitlistImpression";
import type { WaitlistPlacement } from "@/components/molecules/WaitlistCard";

type Props = {
  id?: string;
  eyebrow: string;
  heading: string;
  subtitle: string;
  placement: WaitlistPlacement;
};

export function NewsletterCta({
  id,
  eyebrow,
  heading,
  subtitle,
  placement,
}: Props) {
  return (
    <section
      id={id}
      className="relative overflow-hidden border-y border-line bg-bg py-20 md:py-24"
    >
      <WaitlistImpression placement={placement} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_700px_400px_at_15%_0%,var(--ui-glow-accent-soft),transparent_64%),radial-gradient(ellipse_760px_460px_at_85%_100%,var(--ui-glow-cool-soft),transparent_70%)]"
      />
      <div
        aria-hidden
        className="home-grid pointer-events-none absolute inset-0 opacity-[0.08] [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_82%,transparent_100%)]"
        style={{ backgroundSize: "36px 36px" }}
      />

      <div className="relative mx-auto max-w-295 px-6">
        <div className="text-center">
          <span className="inline-flex items-center rounded-md border border-accent/35 bg-accent/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.12)]">
            {eyebrow}
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
            {subtitle}
          </p>
        </div>

        <div className="ui-panel relative mx-auto mt-10 max-w-[38.4rem] overflow-hidden rounded-xl p-4 shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.12),0_24px_70px_-28px_oklch(0_0_0/0.9)] sm:p-5 md:mt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-line-strong to-transparent"
          />
          <NewsletterForm className="relative max-w-none" />
        </div>
      </div>
    </section>
  );
}
