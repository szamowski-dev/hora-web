import type { Metadata } from "next";
import Image from "next/image";
import { Icon, type IconName } from "@/components/atoms/Icon";
import { Prose } from "@/components/atoms/Prose";
import { AboutContactLink } from "@/components/molecules/AboutContactLink";
import { AboutCtaFooter } from "@/components/organisms/AboutCtaFooter";
import { PagePortableText } from "@/components/sanity/PagePortableText";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

const statTones = [
  "text-label-red",
  "text-label-blue",
  "text-label-green",
  "text-label-purple",
] as const;

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
      <section
        data-nav-underlay="flush"
        className="relative bg-bg px-5 pb-20 pt-32 sm:px-10 sm:pb-28 sm:pt-44"
      >
        <div className="mx-auto max-w-landing">
          <div className="grid gap-12 lg:grid-cols-[1.32fr_0.68fr] lg:items-center">
            <div className="max-w-4xl">
              <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-text sm:text-7xl">
                {about.hero.title.prefix} {about.hero.title.accent}
              </h1>
              <p className="mt-7 max-w-2xl text-balance text-lg leading-8 text-muted sm:text-xl">
                {about.hero.subtitle}
              </p>
            </div>

            <Card className="gap-0 px-0 py-0">
              <CardHeader className="px-6 pb-5 pt-6 sm:px-7 sm:pt-7">
                <div className="flex items-center gap-4">
                <Image
                  src={author.portrait.src}
                  alt={author.portrait.alt}
                  width={author.portrait.width}
                  height={author.portrait.height}
                  placeholder={author.portrait.blurDataUrl ? "blur" : undefined}
                  blurDataURL={author.portrait.blurDataUrl}
                    className="size-18 rounded-full border border-line-strong object-cover"
                  priority
                />
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-text">{author.name}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{author.role}</p>
                </div>
              </div>
              </CardHeader>
              <CardContent className="border-t border-line px-6 py-5 sm:px-7 sm:py-6">
                <p className="text-sm leading-6 text-muted">
                  {about.profile.summary}
                </p>
              </CardContent>
            </Card>
          </div>

          <dl className="mt-16 grid grid-cols-2 border-y border-line sm:mt-20 md:grid-cols-4">
            {about.stats.map(({ value, label, detail }, index) => (
              <div
                key={label}
                className={`py-7 md:px-6 md:py-9 ${
                  index % 2 === 0 ? "pr-4" : "border-l border-line pl-4"
                } ${index > 1 ? "border-t border-line md:border-t-0" : ""} ${
                  index > 0 ? "md:border-l md:border-line" : "md:pl-0"
                }`}
              >
                <dd
                  className={`text-3xl font-semibold leading-none tracking-tight md:text-4xl ${statTones[index % statTones.length]}`}
                >
                  {value}
                </dd>
                <dt className="mt-3 text-sm font-semibold text-text">{label}</dt>
                <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Separator
        aria-hidden="true"
        className="mx-auto max-w-16 bg-text/15 sm:max-w-24"
      />

      <section className="bg-bg px-5 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-landing">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16">
            <aside className="lg:sticky lg:top-28">
              <p className="text-sm font-semibold text-muted">
                {about.story.eyebrow}
              </p>
              <blockquote className="mt-6 border-l border-label-red pl-6">
                <p className="text-balance text-2xl font-semibold leading-snug tracking-[-0.035em] text-text sm:text-3xl">
                  {about.story.quote}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted">
                  {about.story.quoteDetail}
                </p>
              </blockquote>

              <div className="mt-8 flex flex-col gap-1 border-t border-line pt-6">
                {about.contacts.map(({ href, label, kind }) => (
                  <AboutContactLink
                    key={`${kind}:${href}`}
                    href={href}
                    external={/^https?:\/\//.test(href)}
                    className="flex min-h-11 min-w-0 items-center gap-3 rounded-xl px-3 text-sm text-muted transition-colors hover:bg-overlay hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
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

            <Card className="gap-0 px-0 py-0">
              <CardContent className="px-6 py-8 sm:px-10 sm:py-12">
                <Prose className="prose-h2:border-t prose-h2:border-line prose-h2:pt-9 first:prose-h2:mt-0 first:prose-h2:border-t-0 first:prose-h2:pt-0">
                  <PagePortableText value={about.story.body} />
                </Prose>
              </CardContent>
            </Card>
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
