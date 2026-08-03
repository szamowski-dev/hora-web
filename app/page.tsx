import type { Metadata } from "next";
import { ProductLanding } from "@/components/organisms/ProductLanding";
import { getHomePage } from "@/lib/home-repository";
import { defaultOg } from "@/lib/og";

export const revalidate = 600;

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Maciej Szamowski",
  url: "https://szamowski.dev",
  sameAs: [
    "https://x.com/moto_szama",
    "https://bsky.app/profile/szamski.bsky.social",
    "https://github.com/szamski",
  ],
};

const videoLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "hora Calendar — a native macOS client for Google Calendar",
  description:
    "A video tour of hora Calendar on macOS: day, week, and month views, drag & drop rescheduling, and native Google Calendar sync. No Electron, no CalDAV — just fast SwiftUI.",
  thumbnailUrl: [
    "https://i.ytimg.com/vi/ahVV5J25cYM/maxresdefault.jpg",
    "https://i.ytimg.com/vi/ahVV5J25cYM/hqdefault.jpg",
  ],
  uploadDate: "2026-04-24T00:00:00+00:00",
  contentUrl: "https://www.youtube.com/watch?v=ahVV5J25cYM",
  embedUrl: "https://www.youtube.com/embed/ahVV5J25cYM",
  publisher: {
    "@type": "Organization",
    name: "hora Calendar",
    logo: {
      "@type": "ImageObject",
      url: "https://horacal.app/assets/brand/hora-icon.png",
    },
  },
};

export default async function Home() {
  const content = await getHomePage();
  const softwareAppLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "hora Calendar",
    description: content.seo.description,
    url: "https://horacal.app",
    applicationCategory: "BusinessApplication",
    operatingSystem: "macOS",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "29.99",
      highPrice: "49.00",
      priceCurrency: "USD",
      offerCount: 2,
    },
    author: {
      "@type": "Person",
      name: content.integrations.founderNote.author.name,
      url: "https://szamowski.dev",
    },
    image: "https://horacal.app/assets/brand/hora-icon.png",
    screenshot: content.hero.screenshot.src,
  };

  return (
    <>
      <ProductLanding content={content} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }}
      />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomePage();
  const ogImage = content.seo.ogImage;
  const socialTitle = content.seo.ogTitle ?? content.seo.title;
  const socialDescription =
    content.seo.ogDescription ?? content.seo.description;
  const socialImage = ogImage?.src ?? "/assets/seo/default-og-image.png";

  return {
    title: { absolute: content.seo.title },
    description: content.seo.description,
    alternates: { canonical: "/" },
    robots: {
      index: !content.seo.noIndex,
      follow: true,
    },
    openGraph: defaultOg({
      title: socialTitle,
      description: socialDescription,
      url: "https://horacal.app/",
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage.src,
                width: ogImage.width,
                height: ogImage.height,
                alt: ogImage.alt,
              },
            ],
          }
        : {}),
    }),
    twitter: {
      card: "summary_large_image",
      site: "@moto_szama",
      creator: "@moto_szama",
      title: socialTitle,
      description: socialDescription,
      images: [socialImage],
    },
  };
}
