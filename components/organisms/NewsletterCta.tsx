import { NewsletterForm } from "@/components/molecules/NewsletterForm";
import { WaitlistImpression } from "@/components/molecules/WaitlistImpression";
import type { NewsletterPlacement } from "@/lib/analyticsSchema";

type Props = {
  id?: string;
  eyebrow: string;
  heading: string;
  subtitle: string;
  placement: NewsletterPlacement;
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
      className="bg-bg px-5 py-24 sm:px-10 sm:py-32"
    >
      <WaitlistImpression placement={placement} />
      <div className="mx-auto max-w-landing">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {eyebrow}
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-text sm:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
            {subtitle}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-[38.4rem]">
          <NewsletterForm
            placement={placement}
            className="relative max-w-none"
          />
        </div>
      </div>
    </section>
  );
}
