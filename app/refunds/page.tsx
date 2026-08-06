import type { Metadata } from "next";
import { PagePortableText } from "@/components/sanity/PagePortableText";
import { LegalPageLayout } from "@/components/templates/LegalPageLayout";
import { defaultOg } from "@/lib/og";
import { getLegalPage } from "@/lib/site-page-repository";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getLegalPage("refunds");
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical: "/refunds/" },
    ...(seo.noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: defaultOg({
      title: seo.ogTitle ?? seo.metaTitle,
      description: seo.ogDescription ?? seo.metaDescription,
      url: "https://horacal.app/refunds/",
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

export default async function RefundsPage() {
  const page = await getLegalPage("refunds");
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
