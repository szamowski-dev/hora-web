import type { Metadata } from "next";
import Image from "next/image";
import { Icon, type IconName } from "@/components/atoms/Icon";
import { Prose } from "@/components/atoms/Prose";
import { SectionBackdrop } from "@/components/atoms/SectionBackdrop";
import { AboutContactLink } from "@/components/molecules/AboutContactLink";
import { AboutCtaFooter } from "@/components/organisms/AboutCtaFooter";
import { site } from "@/content/site";
import { getPageMdx } from "@/lib/mdx";
import { defaultOg } from "@/lib/og";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await getPageMdx("about");
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical: "/about/" },
    openGraph: defaultOg({
      title: frontmatter.title,
      description: frontmatter.description,
      url: "https://horacal.app/about/",
    }),
  };
}

const stats: ReadonlyArray<{ value: string; label: string; sub: string }> = [
  { value: "16+", label: "years", sub: "working in marketing" },
  { value: "3", label: "big-tech stints", sub: "Samsung, TikTok, Ubisoft" },
  { value: "16k+", label: "lines of Swift", sub: "shipped in two years" },
  { value: "1", label: "solo developer", sub: "building from Poland" },
];

const contacts: ReadonlyArray<{
  href: string;
  label: string;
  icon: IconName;
  external?: boolean;
}> = [
  { href: `mailto:${site.contactEmail}`, label: site.contactEmail, icon: "mail" },
  { href: "https://x.com/moto_szama", label: "@moto_szama", icon: "x", external: true },
  {
    href: "https://bsky.app/profile/szamski.bsky.social",
    label: "@szamski.bsky.social",
    icon: "bluesky",
    external: true,
  },
  { href: "https://github.com/szamski", label: "@szamski", icon: "github", external: true },
];

export default async function AboutPage() {
  const { content } = await getPageMdx("about");

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Maciej Szamowski",
    url: "https://horacal.app/about/",
    image: "https://horacal.app/assets/people/maciej-szamowski.jpg",
    jobTitle: "Independent macOS developer",
    worksFor: { "@id": "https://horacal.app/#organization" },
    nationality: "Polish",
    sameAs: [
      "https://szamowski.dev",
      "https://x.com/moto_szama",
      "https://github.com/szamski",
      "https://bsky.app/profile/szamski.bsky.social",
    ],
  };

  return (
    <>
      <section className="home-section relative overflow-hidden border-y py-16 md:py-24">
        <SectionBackdrop direction="balanced" />

        <div className="relative mx-auto max-w-295 px-6">
          <div className="grid gap-10 border-b border-line-strong pb-10 md:grid-cols-[1.3fr_0.7fr] md:items-end md:pb-12">
            <div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.04] tracking-tight text-text md:text-[64px]">
                A native Mac calendar, built by{" "}
                <span className="text-accent">one person.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted md:text-lg md:leading-8">
                hora Calendar is my answer to years of switching between calendar
                apps that never quite felt right on the Mac.
              </p>
            </div>

            <div className="shader-panel ui-panel relative overflow-hidden rounded-xl p-5 md:p-6">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent"
              />
              <div className="flex items-center gap-4">
                <Image
                  src="/assets/people/maciej-szamowski.jpg"
                  alt="Maciej Szamowski"
                  width={72}
                  height={72}
                  className="h-18 w-18 rounded-full border border-line-strong object-cover shadow-[0_14px_35px_-18px_oklch(0_0_0/0.95)]"
                  priority
                />
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-text">Maciej Szamowski</p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    Founder, designer and developer
                  </p>
                </div>
              </div>
              <p className="mt-5 border-t border-line pt-5 text-sm leading-6 text-muted">
                Marketer turned Swift developer, shipping hora independently
                from Poland.
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-2 md:grid-cols-4">
            {stats.map(({ value, label, sub }, index) => (
              <div
                key={label}
                className={`py-6 md:px-6 md:py-8 ${
                  index % 2 === 0 ? "pr-4" : "border-l border-line pl-4"
                } ${index > 1 ? "border-t border-line md:border-t-0" : ""} ${
                  index > 0 ? "md:border-l md:border-line" : "md:pl-0"
                }`}
              >
                <dd className="text-3xl font-semibold leading-none tracking-tight text-accent md:text-4xl">
                  {value}
                </dd>
                <dt className="mt-3 text-sm font-semibold text-text">{label}</dt>
                <p className="mt-1 text-xs leading-5 text-muted">{sub}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="home-section relative overflow-hidden border-y py-16 md:py-24">
        <SectionBackdrop direction="right" />

        <div className="relative mx-auto max-w-295 px-6">
          <div className="grid gap-8 lg:grid-cols-[0.64fr_1.36fr] lg:items-start">
            <aside className="lg:sticky lg:top-24">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-dim">
                Why I built it
              </p>
              <blockquote className="shader-panel-soft ui-panel-soft mt-4 rounded-xl p-6 md:p-7">
                <span className="text-3xl leading-none text-accent" aria-hidden>
                  “
                </span>
                <p className="mt-3 text-xl font-semibold leading-snug tracking-tight text-text md:text-2xl">
                  The Mac calendar Google never built.
                </p>
                <p className="mt-4 text-sm leading-6 text-muted">
                  Native, focused and shipped in public by one person.
                </p>
              </blockquote>

              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {contacts.map(({ href, label, icon, external }) => (
                  <AboutContactLink
                    key={label}
                    href={href}
                    external={external}
                    className="ui-interactive ui-panel-soft flex min-w-0 items-center gap-3 rounded-lg px-4 py-3 text-sm text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <Icon name={icon} size={15} className="shrink-0 text-accent" />
                    <span className="truncate">{label}</span>
                  </AboutContactLink>
                ))}
              </div>
            </aside>

            <article className="shader-panel ui-panel-deep relative overflow-hidden rounded-xl p-6 md:p-9 lg:p-12">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent"
              />
              <Prose className="prose-h2:border-t prose-h2:border-line prose-h2:pt-9 first:prose-h2:mt-0 first:prose-h2:border-t-0 first:prose-h2:pt-0">
                {content}
              </Prose>
            </article>
          </div>
        </div>
      </section>

      <AboutCtaFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </>
  );
}
