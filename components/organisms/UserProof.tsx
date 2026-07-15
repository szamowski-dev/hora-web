import { SectionBackdrop } from "@/components/atoms/SectionBackdrop";
import { AnimatedCount } from "@/components/molecules/AnimatedCount";
import { TestimonialsCarousel } from "@/components/molecules/TestimonialsCarousel";
import type { HomePageContent } from "@/lib/home-model";

export function UserProof({
  content,
  liveCount,
}: {
  content: HomePageContent["socialProof"];
  liveCount: number;
}) {
  return (
    <section className="home-section relative overflow-hidden border-y py-20 md:py-24">
      <SectionBackdrop direction="left" />

      <div className="relative mx-auto max-w-295 px-6">
        <div className="max-w-5xl">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
            {content.titlePrefix}{" "}
            <span className="text-accent">{content.titleAccent}</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:mt-14 md:auto-rows-[14.5rem] md:grid-cols-[0.72fr_1.28fr] md:items-stretch">
          <div className="shader-panel ui-panel relative flex min-h-[13.5rem] flex-col justify-center overflow-hidden rounded-lg p-6 md:h-full md:min-h-0">
            <div>
              <p className="text-7xl font-semibold leading-[0.88] tracking-tight text-accent md:text-8xl">
                <AnimatedCount value={liveCount} />+
              </p>
              <p className="mt-4 max-w-sm text-balance text-base font-semibold leading-snug text-text md:text-lg">
                {content.description}
              </p>
            </div>
          </div>

          <TestimonialsCarousel quotes={content.testimonials} />
        </div>
      </div>
    </section>
  );
}
