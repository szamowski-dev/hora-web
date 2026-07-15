import { stegaClean } from "next-sanity";
import { cn } from "@/lib/cn";
import type { SanityBlogVideoValue } from "@/sanity/lib/queries";

export function SanityBlogVideo({ value }: { value: SanityBlogVideoValue }) {
  const webmUrl = value.webmUrl ? stegaClean(value.webmUrl) : undefined;
  if (!webmUrl) return null;

  const mp4Url = value.mp4Url ? stegaClean(value.mp4Url) : undefined;
  const poster = value.poster?.asset?.url
    ? stegaClean(value.poster.asset.url)
    : undefined;
  const hasGlow = stegaClean(value.presentation) === "glow";
  const autoPlay = value.autoplay ?? true;

  return (
    <figure
      aria-label={value.accessibilityLabel}
      className="blog-wide my-8"
    >
      <video
        autoPlay={autoPlay}
        loop={value.loop ?? true}
        muted={value.muted ?? true}
        controls={!autoPlay}
        playsInline
        poster={poster}
        className={cn(
          "m-0 h-auto w-full rounded-xl border-0",
          hasGlow &&
            "shadow-[0_28px_86px_-54px_rgba(255,56,60,0.48),0_36px_100px_-42px_rgba(0,0,0,0.9)]",
        )}
      >
        <source src={webmUrl} type="video/webm" />
        {mp4Url ? <source src={mp4Url} type="video/mp4" /> : null}
      </video>
      {value.caption ? (
        <figcaption className="mt-3 text-center font-sans text-sm leading-5 text-muted">
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
