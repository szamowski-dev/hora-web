import type { Metadata } from "next";
import { PagePortableText } from "@/components/sanity/PagePortableText";
import { LegalPageLayout } from "@/components/templates/LegalPageLayout";
import { defaultOg } from "@/lib/og";
import { getLegalPage } from "@/lib/site-page-repository";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getLegalPage("trust");
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical: "/trust/" },
    ...(seo.noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: defaultOg({
      title: seo.ogTitle ?? seo.metaTitle,
      description: seo.ogDescription ?? seo.metaDescription,
      url: "https://horacal.app/trust/",
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

export default async function TrustPage() {
  const page = await getLegalPage("trust");
  return (
    <LegalPageLayout
      kind={page.kind}
      title={page.title}
      lastUpdated={page.lastUpdated}
    >
      <PagePortableText value={page.body} />
    </LegalPageLayout>
  );
}
