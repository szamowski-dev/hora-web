import { FaqItem } from "@/components/molecules/FaqItem";
import { home } from "@/content/home";

export function Faq() {
  const faq = home.faq;
  const leftColumnItems = faq.items.filter((_, index) => index % 2 === 0);
  const rightColumnItems = faq.items.filter((_, index) => index % 2 === 1);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden border-y border-white/8 bg-[#0b0c0f] py-20 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_420px_at_15%_0%,rgba(255,56,60,0.09),transparent_68%)]"
      />

      <div className="relative mx-auto max-w-295 px-6">
        <div className="max-w-5xl">
          <div>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
              {faq.heading.prefix}
              <span className="text-accent"> {faq.heading.suffixGradient}</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
              {faq.subtitle}
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-3 md:mt-14 md:grid-cols-2 md:gap-4">
          <div className="space-y-3 md:space-y-4">
            {leftColumnItems.map((item) => (
              <div key={item.q} data-anim="faq-item">
                <FaqItem question={item.q} answer={item.a} />
              </div>
            ))}
          </div>
          <div className="space-y-3 md:space-y-4">
            {rightColumnItems.map((item) => (
              <div key={item.q} data-anim="faq-item">
                <FaqItem question={item.q} answer={item.a} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-sm text-muted">
          Still have questions?{" "}
          <a
            href="mailto:hello@horacal.app"
            className="text-accent underline decoration-accent/40 underline-offset-4 hover:text-text"
          >
            Contact me
          </a>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
