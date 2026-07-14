import { NewsletterCta } from "@/components/organisms/NewsletterCta";
import { home } from "@/content/home";
import {
  ANALYTICS_PLACEMENTS,
  type NewsletterPlacement,
} from "@/lib/analyticsSchema";

export function BetaCta({
  placement = ANALYTICS_PLACEMENTS.betaCta,
}: {
  placement?: NewsletterPlacement;
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
