import { SectionBackdrop } from "@/components/atoms/SectionBackdrop";
import { FaqItem } from "@/components/molecules/FaqItem";
import type { BlogFaqBlock, BlogFaqItem } from "@/lib/blog-model";

function faqAnswerText(item: BlogFaqItem) {
  return (
    item.plainAnswer ??
    (typeof item.answer === "string" || typeof item.answer === "number"
      ? String(item.answer)
      : "")
  );
}

export function BlogFaq({
  id,
  heading = "Frequently asked questions",
  intro,
  items,
}: BlogFaqBlock) {
  if (items.length === 0) return null;

  const headingId = `${id}-heading`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: faqAnswerText(item) },
    })),
  };
  const serializedJsonLd = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="blog-wide not-prose home-section relative my-14 scroll-mt-28 overflow-hidden rounded-xl border border-line px-5 py-7 sm:px-7 sm:py-8 md:my-16 md:px-9 md:py-9"
    >
      <SectionBackdrop direction="left" grid={false} />

      <div className="relative">
        <header className="flex flex-col gap-3 border-b border-line-strong pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id={headingId}
              className="m-0 font-sans text-2xl font-semibold leading-tight tracking-[-0.03em] text-text sm:text-3xl"
            >
              {heading}
            </h2>
            {intro ? (
              <p className="m-0 mt-3 max-w-2xl font-sans text-sm leading-6 text-muted sm:text-base">
                {intro}
              </p>
            ) : null}
          </div>
          <p className="m-0 shrink-0 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-dim">
            {String(items.length).padStart(2, "0")} questions / quick answers
          </p>
        </header>

        <div className="shader-panel ui-panel-deep relative mt-6 overflow-hidden rounded-lg">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-0 z-10 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent"
          />
          {items.map((item, index) => (
            <div
              key={item.id}
              className={
                index < items.length - 1 ? "border-b border-line" : undefined
              }
            >
              <FaqItem
                question={item.question}
                answer={item.answer}
                index={index}
                variant="integrated"
              />
            </div>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedJsonLd }}
      />
    </section>
  );
}
