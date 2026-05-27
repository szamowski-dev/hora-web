import type { Metadata } from "next";
import { Icon } from "@/components/atoms/Icon";
import { FaqItem } from "@/components/molecules/FaqItem";
import { SupportForm } from "@/components/organisms/SupportForm";
import { defaultOg } from "@/lib/og";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with hora Calendar, report bugs, and read answers to common questions about sync, privacy, accounts, and TestFlight.",
  alternates: { canonical: "/support/" },
  openGraph: defaultOg({
    title: "Support — hora Calendar",
    description:
      "Report a problem or ask for help with hora Calendar. Support tickets go straight into our GitHub issue tracker.",
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
    a: "During the beta, support is handled directly by the developer. Critical sync or data-loss issues get priority; other requests are usually handled around build cycles.",
  },
  {
    q: "Can I request a feature?",
    a: "Yes. Feature requests are welcome, especially when they explain the real calendar workflow behind the request.",
  },
  {
    q: "Is TestFlight the current way to install hora?",
    a: "Yes, while hora is in beta. Join the waitlist or use your existing TestFlight invite to install the latest build.",
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
      <section className="relative overflow-hidden border-b border-white/8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_420px_at_22%_12%,rgba(255,56,60,0.19),transparent_68%),radial-gradient(700px_420px_at_88%_42%,rgba(131,199,255,0.08),transparent_72%)]"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-bg" />

        <div className="relative mx-auto max-w-[1180px] px-6 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-accent/25 bg-accent/10 text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                <Icon name="hand-heart" size={22} />
              </div>
              <h1 className="mt-6 max-w-[12ch] text-5xl font-semibold leading-[1.04] tracking-tight text-text md:text-[64px]">
                hora <span className="text-accent">Support</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted md:text-lg md:leading-8">
                Report a bug, ask for help, or send a feature request. The form
                creates a support ticket in our GitHub issue tracker so it lands
                directly in the development workflow.
              </p>

              <div className="mt-8 grid gap-3">
                {quickLinks.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-md border border-white/10 bg-white/[0.035] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-accent">
                        <Icon name={item.icon} size={17} />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-text">{item.title}</h2>
                        <p className="mt-1 text-sm leading-6 text-muted">{item.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SupportForm />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0b0c0f] py-16 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_420px_at_15%_0%,rgba(255,56,60,0.08),transparent_68%)]"
        />
        <div className="relative mx-auto max-w-[1180px] px-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
              Common questions
            </h2>
            <p className="mt-4 text-base leading-7 text-muted md:text-lg md:leading-8">
              Short answers about how hora works, what to include in support
              tickets, and how beta support is handled.
            </p>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-2 md:gap-4">
            {faqItems.map((item) => (
              <FaqItem key={item.q} question={item.q} answer={item.a} />
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
