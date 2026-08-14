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
      className="blog-wide not-prose home-section my-14 scroll-mt-28 md:my-16"
    >
      <header>
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
      </header>

      <div className="mt-7 overflow-hidden rounded-[28px] border border-line bg-panel/55">
        {items.map((item) => (
          <FaqItem
            key={item.id}
            question={item.question}
            answer={item.answer}
            variant="pricing"
          />
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedJsonLd }}
      />
    </section>
  );
}
