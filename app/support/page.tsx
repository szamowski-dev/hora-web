import type { Metadata } from "next";
import { Icon } from "@/components/atoms/Icon";
import { FaqItem } from "@/components/molecules/FaqItem";
import { SupportForm } from "@/components/organisms/SupportForm";
import { SitePageHero } from "@/components/templates/SitePageHero";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { defaultOg } from "@/lib/og";
import {
  DIRECT_SUPPORT_REFUND_BODY,
  DIRECT_SUPPORT_REFUND_FAQ,
  DIRECT_SUPPORT_REFUND_TITLE,
  HORA_INSTALLATION_FAQ,
} from "@/lib/direct/support-content";

export const metadata: Metadata = {
  title: "hora Calendar Support",
  description:
    "Get help with hora Calendar, report bugs, and read answers to common questions about sync, privacy, accounts, and the Mac App Store.",
  alternates: { canonical: "/support/" },
  openGraph: defaultOg({
    title: "Support — hora Calendar",
    description:
      "Report a problem, ask for help, or join the hora Discord for real-time feedback and bug reports.",
    url: "https://horacal.app/support/",
  }),
};

const quickLinks = [
  {
    icon: "sync" as const,
    color: "text-label-blue",
    title: "Sync problems",
    body: "Include the account type, affected calendar, and whether changes appear in Google Calendar web.",
  },
  {
    icon: "keyboard" as const,
    color: "text-label-purple",
    title: "Feature requests",
    body: "Describe the workflow you are trying to complete, not only the button you want added.",
  },
  {
    icon: "shield" as const,
    color: "text-label-green",
    title: "Privacy notes",
    body: "Avoid sending event titles, attendee names, tokens, or screenshots with private calendar data.",
  },
  {
    icon: "hand-heart" as const,
    color: "text-label-yellow",
    title: DIRECT_SUPPORT_REFUND_TITLE,
    body: DIRECT_SUPPORT_REFUND_BODY,
  },
];

const faqItems = [
  {
    q: "Does hora store my Google Calendar data on your servers?",
    a: "No. hora is a native macOS app and uses Google Calendar directly. Calendar data is cached locally on your Mac for speed and offline resilience.",
  },
  {
    q: "Why does hora ask for Google Calendar access?",
    a: "hora needs Google Calendar permission to read calendars, create and update events, manage invitations, and keep the native app in sync with Google.",
  },
  {
    q: "What should I include in a bug report?",
    a: "Please include the app version, macOS version, what you expected, what happened instead, and the shortest steps that reproduce the issue.",
  },
  {
    q: "How fast do you respond?",
    a: "Support is handled directly by the developer. Critical sync or data-loss issues get priority; other requests are usually handled around build cycles.",
  },
  {
    q: "Can I request a feature?",
    a: "Yes. Feature requests are welcome, especially when they explain the real calendar workflow behind the request.",
  },
  {
    q: "How do I install hora?",
    a: HORA_INSTALLATION_FAQ,
  },
  {
    q: "How do I request a refund for a direct purchase?",
    a: DIRECT_SUPPORT_REFUND_FAQ,
  },
];

export default function SupportPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <SitePageHero
        title="Support for your calendar."
        description="Report a bug, ask for help, or send a feature request. Every message goes directly to the developer."
        meta="Direct developer support"
      />

      <section className="bg-bg px-5 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-landing">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12 xl:grid-cols-4">
            {quickLinks.map((item) => (
              <article key={item.title} className="flex flex-col items-start">
                <span className={item.color}>
                  <Icon name={item.icon} size={28} />
                </span>
                <h2 className="mt-5 text-xl font-semibold tracking-[-0.025em] text-text">
                  {item.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-muted">
                  {item.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-4xl sm:mt-24">
            <SupportForm />
          </div>
        </div>
      </section>

      <Separator
        aria-hidden="true"
        className="mx-auto max-w-16 bg-text/15 sm:max-w-24"
      />

      <section className="bg-bg px-5 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-landing">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-text sm:text-5xl">
              Common questions
            </h2>
            <p className="max-w-2xl text-balance text-base leading-7 text-muted sm:text-lg">
              Short answers about how hora works and what to include when you
              need help.
            </p>
          </div>

          <Card className="mx-auto mt-10 max-w-5xl gap-0 overflow-hidden rounded-[20px] border-line/80 bg-feature-panel/45 px-0 py-0 shadow-[0_24px_80px_-56px_oklch(0_0_0/0.95)] sm:mt-14">
            {faqItems.map((item, index) => (
              <div
                key={item.q}
                className={
                  index < faqItems.length - 1
                    ? "border-b border-line"
                    : undefined
                }
              >
                <FaqItem
                  question={item.q}
                  answer={item.a}
                  index={index}
                  variant="integrated"
                  density="compact"
                />
              </div>
            ))}
          </Card>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
