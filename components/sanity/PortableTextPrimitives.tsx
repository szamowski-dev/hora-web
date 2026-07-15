import {
  PortableText,
  stegaClean,
  toPlainText,
  type PortableTextComponents,
} from "next-sanity";
import { MdxLink } from "@/components/mdx/MdxLink";
import type {
  SanityExternalLink,
  SanityInternalPathLink,
  SanityInternalPostLink,
  SanityTextBlock,
} from "@/sanity/lib/queries";

const linkClassName =
  "font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent-hover";

export const portableTextMarks: NonNullable<
  PortableTextComponents<SanityTextBlock>["marks"]
> = {
  strong: ({ children }) => <strong>{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  code: ({ children }) => <code>{children}</code>,
  externalLink: ({ children, value }) => {
    const link = value as SanityExternalLink | undefined;
    if (!link?.href) return <>{children}</>;
    const href = stegaClean(link.href);

    return (
      <MdxLink
        href={href}
        target={link.openInNewTab === false ? "_self" : "_blank"}
        rel={link.openInNewTab === false ? undefined : "noopener noreferrer"}
        className={linkClassName}
      >
        {children}
      </MdxLink>
    );
  },
  internalPostLink: ({ children, value }) => {
    const link = value as SanityInternalPostLink | undefined;
    const slug = link?.post?.slug ? stegaClean(link.post.slug) : undefined;
    if (!slug) return <>{children}</>;

    const anchor = link?.anchor
      ? stegaClean(link.anchor).replace(/^#/, "")
      : undefined;
    const href = `/blog/${slug}/${anchor ? `#${anchor}` : ""}`;
    return (
      <MdxLink href={href} className={linkClassName}>
        {children}
      </MdxLink>
    );
  },
  internalPathLink: ({ children, value }) => {
    const link = value as SanityInternalPathLink | undefined;
    if (!link?.path) return <>{children}</>;

    return (
      <MdxLink href={stegaClean(link.path)} className={linkClassName}>
        {children}
      </MdxLink>
    );
  },
};

export function PortableTextParagraphs({
  value,
}: {
  value: readonly SanityTextBlock[];
}) {
  return (
    <PortableText
      value={[...value]}
      components={{
        block: {
          normal: ({ children }) => (
            <p className="m-0 [&+&]:mt-3">{children}</p>
          ),
        },
        marks: portableTextMarks,
      }}
    />
  );
}

export function PortableTextCell({
  value,
}: {
  value: readonly SanityTextBlock[];
}) {
  return (
    <PortableText
      value={[...value]}
      components={{
        block: {
          normal: ({ children }) => <>{children}</>,
        },
        marks: portableTextMarks,
      }}
    />
  );
}

export function portableTextToPlainText(
  value: readonly SanityTextBlock[] | undefined,
): string {
  return value?.length ? toPlainText([...value]) : "";
}
