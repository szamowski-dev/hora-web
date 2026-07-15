import type { Metadata } from "next";
import Image from "next/image";
import { Icon, type IconName } from "@/components/atoms/Icon";
import { Prose } from "@/components/atoms/Prose";
import { SectionBackdrop } from "@/components/atoms/SectionBackdrop";
import { AboutContactLink } from "@/components/molecules/AboutContactLink";
import { AboutCtaFooter } from "@/components/organisms/AboutCtaFooter";
import { PagePortableText } from "@/components/sanity/PagePortableText";
import { defaultOg } from "@/lib/og";
import type { AboutContactKind } from "@/lib/site-page-model";
import { getAboutPage } from "@/lib/site-page-repository";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAboutPage();
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical: "/about/" },
    ...(seo.noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: defaultOg({
      title: seo.ogTitle ?? seo.metaTitle,
      description: seo.ogDescription ?? seo.metaDescription,
      url: "https://horacal.app/about/",
      ...(seo.ogImage
        ? {
            images: [
              {
                url: seo.ogImage.src,
                width: seo.ogImage.width,
                height: seo.ogImage.height,
                alt: seo.ogImage.alt,
              },
            ],
          }
        : {}),
    }),
  };
}

const contactIcons: Record<AboutContactKind, IconName> = {
  email: "mail",
  website: "app-window",
  x: "x",
  bluesky: "bluesky",
  github: "github",
};

export default async function AboutPage() {
  const about = await getAboutPage();
  const { author } = about.profile;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: "https://horacal.app/about/",
    image: author.portrait.src,
    jobTitle: author.role,
    worksFor: { "@id": "https://horacal.app/#organization" },
    nationality: "Polish",
    sameAs: about.contacts
      .map((contact) => contact.href)
      .filter((href) => /^https?:\/\//.test(href)),
  };

  return (
    <>
      <section className="home-section relative overflow-hidden border-y py-16 md:py-24">
        <SectionBackdrop direction="balanced" />

        <div className="relative mx-auto max-w-295 px-6">
          <div className="grid gap-10 border-b border-line-strong pb-10 md:grid-cols-[1.3fr_0.7fr] md:items-end md:pb-12">
            <div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.04] tracking-tight text-text md:text-[64px]">
                {about.hero.title.prefix}{" "}
                <span className="text-accent">{about.hero.title.accent}</span>
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted md:text-lg md:leading-8">
                {about.hero.subtitle}
              </p>
            </div>

            <div className="shader-panel ui-panel relative overflow-hidden rounded-xl p-5 md:p-6">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent"
              />
              <div className="flex items-center gap-4">
                <Image
                  src={author.portrait.src}
                  alt={author.portrait.alt}
                  width={author.portrait.width}
                  height={author.portrait.height}
                  placeholder={author.portrait.blurDataUrl ? "blur" : undefined}
                  blurDataURL={author.portrait.blurDataUrl}
                  className="h-18 w-18 rounded-full border border-line-strong object-cover shadow-[0_14px_35px_-18px_oklch(0_0_0/0.95)]"
                  priority
                />
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-text">{author.name}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{author.role}</p>
                </div>
              </div>
              <p className="mt-5 border-t border-line pt-5 text-sm leading-6 text-muted">
                {about.profile.summary}
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-2 md:grid-cols-4">
            {about.stats.map(({ value, label, detail }, index) => (
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
                <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>
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
                {about.story.eyebrow}
              </p>
              <blockquote className="shader-panel-soft ui-panel-soft mt-4 rounded-xl p-6 md:p-7">
                <span className="text-3xl leading-none text-accent" aria-hidden>
                  “
                </span>
                <p className="mt-3 text-xl font-semibold leading-snug tracking-tight text-text md:text-2xl">
                  {about.story.quote}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted">
                  {about.story.quoteDetail}
                </p>
              </blockquote>

              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {about.contacts.map(({ href, label, kind }) => (
                  <AboutContactLink
                    key={`${kind}:${href}`}
                    href={href}
                    external={/^https?:\/\//.test(href)}
                    className="ui-interactive ui-panel-soft flex min-w-0 items-center gap-3 rounded-lg px-4 py-3 text-sm text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <Icon
                      name={contactIcons[kind]}
                      size={15}
                      className="shrink-0 text-accent"
                    />
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
                <PagePortableText value={about.story.body} />
              </Prose>
            </article>
          </div>
        </div>
      </section>

      <AboutCtaFooter content={about.cta} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </>
  );
}
