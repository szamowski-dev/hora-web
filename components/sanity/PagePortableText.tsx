import {
  PortableText,
  stegaClean,
  toPlainText,
  type PortableTextComponents,
} from "next-sanity";
import { ContentLink } from "@/components/atoms/ContentLink";
import { portableTextMarks } from "@/components/sanity/PortableTextPrimitives";
import type {
  SanityExternalLink,
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

function getHeadingIds(value: readonly SanityTextBlock[]) {
  const ids = new Map<string, string>();
  const occurrences = new Map<string, number>();

  value.forEach((block) => {
    if (block.style !== "h2" && block.style !== "h3") return;

    const base = slugifyHeading(toPlainText([block])) || "section";
    const occurrence = occurrences.get(base) ?? 0;
    const id = occurrence === 0 ? base : `${base}-${occurrence}`;
    occurrences.set(base, occurrence + 1);
    if (block._key) ids.set(block._key, id);
  });

  return ids;
}

const pageMarks: NonNullable<
  PortableTextComponents<SanityTextBlock>["marks"]
> = {
  ...portableTextMarks,
  externalLink: ({ children, value }) => {
    const link = value as SanityExternalLink | undefined;
    if (!link?.href) return <>{children}</>;
    const href = stegaClean(link.href);
    const className =
      "font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent-hover";

    if (href.startsWith("mailto:")) {
      return (
        <a href={href} className={className}>
          {children}
        </a>
      );
    }

    return (
      <ContentLink
        href={href}
        target={link.openInNewTab === false ? "_self" : "_blank"}
        rel={link.openInNewTab === false ? undefined : "noopener noreferrer"}
        className={className}
      >
        {children}
      </ContentLink>
    );
  },
};

export function PagePortableText({
  value,
}: {
  value: readonly SanityTextBlock[];
}) {
  const headingIds = getHeadingIds(value);
  const headingId = (block: SanityTextBlock) =>
    (block._key ? headingIds.get(block._key) : undefined) ??
    (slugifyHeading(toPlainText([block])) || "section");

  const components: PortableTextComponents<SanityTextBlock> = {
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
    marks: pageMarks,
  };

  return <PortableText value={[...value]} components={components} />;
}
