import type { Metadata } from "next";
import { Icon } from "@/components/atoms/Icon";
import { SectionBackdrop } from "@/components/atoms/SectionBackdrop";
import { FaqItem } from "@/components/molecules/FaqItem";
import { SupportForm } from "@/components/organisms/SupportForm";
import { defaultOg } from "@/lib/og";

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
    title: "Sync problems",
    body: "Include the account type, affected calendar, and whether changes appear in Google Calendar web.",
  },
  {
    icon: "keyboard" as const,
    title: "Feature requests",
    body: "Describe the workflow you are trying to complete, not only the button you want added.",
  },
  {
    icon: "shield" as const,
    title: "Privacy notes",
    body: "Avoid sending event titles, attendee names, tokens, or screenshots with private calendar data.",
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
    a: "hora is on the Mac App Store — download it there. A native iOS and iPadOS app is coming next; subscribe to the newsletter for a heads-up when the iOS/iPadOS TestFlight beta opens.",
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
      <section className="home-section relative overflow-hidden border-y py-16 md:py-24">
        <SectionBackdrop direction="balanced" />

        <div className="relative mx-auto max-w-295 px-6">
          <div className="flex flex-col gap-6 border-b border-line-strong pb-8 md:flex-row md:items-end md:justify-between md:pb-10">
            <div>
              <h1 className="text-5xl font-semibold leading-[1.04] tracking-tight text-text md:text-[64px]">
                hora <span className="text-accent">Support</span>
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-muted md:text-lg md:leading-8">
                Report a bug, ask for help, or send a feature request. The form
                sends your message directly to the developer, and Discord is
                the fastest place for real-time feedback and follow-ups.
              </p>
            </div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-dim">
              Direct developer support
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start md:mt-12">
            <aside className="lg:sticky lg:top-24">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-dim">
                Before you send
              </p>
              <div className="mt-4 grid gap-3">
                {quickLinks.map((item) => (
                  <div
                    key={item.title}
                    className="ui-panel-soft rounded-lg p-4 shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.08)]"
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-accent/20 bg-accent/8 text-accent">
                        <Icon name={item.icon} size={17} />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-text">
                          {item.title}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-muted">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            <div className="lg:pt-[31px]">
              <SupportForm />
            </div>
          </div>
        </div>
      </section>

      <section className="home-section relative overflow-hidden border-y py-16 md:py-20">
        <SectionBackdrop direction="right" />
        <div className="relative mx-auto max-w-295 px-6">
          <div className="flex flex-col gap-5 border-b border-line-strong pb-8 md:flex-row md:items-end md:justify-between md:pb-10">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
                Common <span className="text-accent">questions</span>
              </h2>
              <p className="mt-4 text-base leading-7 text-muted md:text-lg md:leading-8">
                Short answers about how hora works, what to include in support
                requests, and how beta support is handled.
              </p>
            </div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-dim">
              {String(faqItems.length).padStart(2, "0")} questions / quick
              answers
            </p>
          </div>

          <div className="shader-panel ui-panel-deep relative mt-10 overflow-hidden rounded-xl md:mt-12">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-8 top-0 z-10 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent"
            />
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
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
