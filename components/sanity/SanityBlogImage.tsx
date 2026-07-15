import Image from "next/image";
import { stegaClean } from "next-sanity";
import { cn } from "@/lib/cn";
import {
  sanityImageDimensions,
  sanityImageUrl,
} from "@/sanity/lib/image";
import type { SanityBlogImageValue } from "@/sanity/lib/queries";

export function SanityBlogImage({ value }: { value: SanityBlogImageValue }) {
  const dimensions = sanityImageDimensions(value);
  const width = dimensions.width ?? 1600;
  const height = dimensions.height ?? 900;
  const src = sanityImageUrl(value, { width: Math.min(width, 1920) });
  if (!src) return null;

  const blurDataURL = value.asset?.metadata?.lqip;
  const isWide = stegaClean(value.presentation) !== "content";

  return (
    <figure className={cn("my-8", isWide && "mdx-media")}>
      <Image
        src={src}
        alt={value.alt ?? ""}
        width={width}
        height={height}
        sizes={
          isWide
            ? "(min-width: 1200px) 1120px, calc(100vw - 3rem)"
            : "(min-width: 768px) 760px, calc(100vw - 3rem)"
        }
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        className="m-0 h-auto w-full rounded-lg border border-border bg-panel-deep"
      />
      {value.caption ? (
        <figcaption className="mt-3 text-center font-sans text-sm leading-5 text-muted">
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
