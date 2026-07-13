import { NewsletterCta } from "@/components/organisms/NewsletterCta";
import type { WaitlistPlacement } from "@/components/molecules/WaitlistCard";
import { home } from "@/content/home";

export function BetaCta({
  placement = "beta_cta",
}: {
  placement?: WaitlistPlacement;
}) {
  const cta = home.betaCta;

  return (
    <NewsletterCta
      id="newsletter"
      placement={placement}
      eyebrow={cta.eyebrow}
      heading={cta.heading}
      subtitle={cta.subtitle}
    />
  );
}
