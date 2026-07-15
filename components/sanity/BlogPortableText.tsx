import {
  PortableText,
  stegaClean,
  toPlainText,
  type PortableTextComponents,
} from "next-sanity";
import { BlogFaq } from "@/components/mdx/BlogFaq";
import {
  PortableTextParagraphs,
  portableTextMarks,
  portableTextToPlainText,
} from "@/components/sanity/PortableTextPrimitives";
import { SanityBlogImage } from "@/components/sanity/SanityBlogImage";
import { SanityBlogTable } from "@/components/sanity/SanityBlogTable";
import { SanityBlogVideo } from "@/components/sanity/SanityBlogVideo";
import { SanityCodeBlock } from "@/components/sanity/SanityCodeBlock";
import type {
  SanityBlogBodyValue,
  SanityBlogFaqValue,
  SanityTextBlock,
} from "@/sanity/lib/queries";

function slugifyHeading(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en")
    .replace(/[’']/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getHeadingIds(value: SanityBlogBodyValue) {
  const ids = new Map<string, string>();
  const occurrences = new Map<string, number>();

  value.forEach((item) => {
    if (item._type !== "block") return;

    const block = item as SanityTextBlock;
    if (block.style !== "h2" && block.style !== "h3") return;

    const base = slugifyHeading(toPlainText([block])) || "section";
    const occurrence = occurrences.get(base) ?? 0;
    const id = occurrence === 0 ? base : `${base}-${occurrence}`;
    occurrences.set(base, occurrence + 1);
    if (block._key) ids.set(block._key, id);
  });

  return ids;
}

function SanityFaqBlock({ value }: { value: SanityBlogFaqValue }) {
  const items = (value.items ?? [])
    .filter((item) => item.question && item.answer?.length)
    .map((item, index) => ({
      id: item.anchorId
        ? stegaClean(item.anchorId)
        : item._key ?? `faq-${index + 1}`,
      question: item.question ?? "",
      plainAnswer: portableTextToPlainText(item.answer),
      answer: <PortableTextParagraphs value={item.answer ?? []} />,
    }));

  return (
    <BlogFaq
      id={value.anchorId ? stegaClean(value.anchorId) : "faq"}
      heading={value.heading}
      intro={value.intro}
      items={items}
    />
  );
}

export function BlogPortableText({ value }: { value: SanityBlogBodyValue }) {
  const headingIds = getHeadingIds(value);
  const headingId = (block: SanityTextBlock) =>
    (block._key ? headingIds.get(block._key) : undefined) ??
    (slugifyHeading(toPlainText([block])) || "section");

  const components: PortableTextComponents<SanityBlogBodyValue[number]> = {
    block: {
      h2: ({ children, value: block }) => {
        const id = headingId(block as SanityTextBlock);
        return (
          <h2 id={id}>
            {children}
            <a
              href={`#${id}`}
              className="heading-anchor"
              aria-label="Link to section"
            />
          </h2>
        );
      },
      h3: ({ children, value: block }) => {
        const id = headingId(block as SanityTextBlock);
        return (
          <h3 id={id}>
            {children}
            <a
              href={`#${id}`}
              className="heading-anchor"
              aria-label="Link to section"
            />
          </h3>
        );
      },
    },
    marks: portableTextMarks,
    types: {
      blogImage: ({ value: image }) => <SanityBlogImage value={image} />,
      blogVideo: ({ value: video }) => <SanityBlogVideo value={video} />,
      codeBlock: ({ value: code }) => <SanityCodeBlock value={code} />,
      blogTable: ({ value: table }) => <SanityBlogTable value={table} />,
      blogFaq: ({ value: faq }) => <SanityFaqBlock value={faq} />,
    },
  };

  return <PortableText value={value} components={components} />;
}
