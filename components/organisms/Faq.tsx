import { FaqItem } from "@/components/molecules/FaqItem";
import { Icon } from "@/components/atoms/Icon";
import { SectionBackdrop } from "@/components/atoms/SectionBackdrop";
import { site } from "@/content/site";
import type { HomePageContent } from "@/lib/home-model";

export function Faq({
  content,
}: {
  content: HomePageContent["faq"];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section
      id="faq"
      className="home-section relative overflow-hidden border-y py-20 md:py-24"
    >
      <SectionBackdrop direction="left" />

      <div className="relative mx-auto max-w-295 px-6">
        <div className="flex flex-col gap-5 border-b border-line-strong pb-8 md:flex-row md:items-end md:justify-between md:pb-10">
          <div>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
              {content.titlePrefix}
              <span className="text-accent"> {content.titleAccent}</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
              {content.subtitle}
            </p>
          </div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-dim">
            {String(content.items.length).padStart(2, "0")} questions / quick
            answers
          </p>
        </div>

        <div className="shader-panel ui-panel-deep relative mt-10 overflow-hidden rounded-xl md:mt-12">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-0 z-10 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent"
          />
          <div>
            {content.items.map((item, index) => (
              <div
                key={item.question}
                data-anim="faq-item"
                className={
                  index < content.items.length - 1
                    ? "border-b border-line"
                    : undefined
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

          <div className="flex flex-col gap-4 border-t border-line bg-overlay px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <div>
              <p className="text-sm font-medium text-text">
                {content.footerTitle}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted">
                {content.footerDescription}
              </p>
            </div>
            <a
              href={site.community.discord.href}
              target="_blank"
              rel="noopener noreferrer"
              className="discord-cta-button inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-discord-hover focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Icon name="discord" size={17} />
              {content.footerLinkLabel}
            </a>
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
