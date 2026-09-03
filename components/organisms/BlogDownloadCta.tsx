import Image from "next/image";
import Link from "next/link";
import { MdDownloadForOffline } from "react-icons/md";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { HomebrewCommand } from "@/components/molecules/HomebrewCommand";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PLACEMENTS,
  type BlogPostCtaPlacement,
} from "@/lib/analyticsSchema";
import type { BlogCtaContent } from "@/lib/blog-cta-model";
import { cn } from "@/lib/cn";
import { DIRECT_DOWNLOAD_HREF } from "@/lib/direct/commerce-contract";

/**
 * `aside` sits beside the post title, `rail` is the narrow sticky banner in the
 * article's right margin, `band` is the full-width banner above Topics. One
 * component keeps the copy, the Direct/Mac App Store branching and the
 * analytics contract in a single place — only the shell differs per variant.
 *
 * All three wear the homepage Privacy card's surface: `bg-privacy-panel` holds
 * the same dark neutral in both themes, so every foreground here is a white
 * alpha rather than a `text`/`muted` token.
 */
type BlogCtaVariant = "aside" | "rail" | "band";

const placements: Record<BlogCtaVariant, BlogPostCtaPlacement> = {
  aside: ANALYTICS_PLACEMENTS.blogPostAside,
  rail: ANALYTICS_PLACEMENTS.blogPostRail,
  band: ANALYTICS_PLACEMENTS.blogPostBand,
};

const panelClasses = "bg-privacy-panel text-white";

export function BlogDownloadCta({
  id,
  variant,
  content,
  showDirectDownload = false,
  className,
}: {
  id?: string;
  variant: BlogCtaVariant;
  content: BlogCtaContent;
  showDirectDownload?: boolean;
  className?: string;
}) {
  const slot = content[variant];
  if (!slot.enabled) return null;

  const placement = placements[variant];
  // Only the wide banner above Topics carries the terminal prompt and the
  // system requirement. The title banner stays a single clear ask, and the rail
  // is too narrow for a monospace command.
  const isBand = variant === "band";
  const isRail = variant === "rail";
  const showHomebrew = content.showHomebrew && showDirectDownload && isBand;
  const ctaLabel = slot.ctaLabel ?? content.ctaLabel;

  const downloadButton = showDirectDownload ? (
    <Button
      asChild
      variant="accent"
      size={isBand ? "lg" : "default"}
      className={isBand ? undefined : "w-full"}
    >
      <a
        href={DIRECT_DOWNLOAD_HREF}
        {...analyticsAttrs(ANALYTICS_EVENTS.directDownloadClick, {
          link_text: ctaLabel,
          link_url: DIRECT_DOWNLOAD_HREF,
          placement,
        })}
      >
        <MdDownloadForOffline aria-hidden="true" />
        {ctaLabel}
      </a>
    </Button>
  ) : (
    <AppStoreLink
      href={site.cta.primary.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={content.macAppStoreLabel}
      className="app-store-interactive inline-flex h-12 items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-privacy-panel"
      {...analyticsAttrs("app_store_cta_click", {
        placement,
        destination: "mac_app_store",
      })}
    >
      <Image
        src={site.macAppStoreBadgeSrc}
        alt={content.macAppStoreLabel}
        width={162}
        height={50}
        className="h-12 w-auto"
      />
    </AppStoreLink>
  );

  const trialNote = (
    <Link
      href="/pricing/"
      className="inline-flex text-xs font-medium text-white/70 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-privacy-panel"
    >
      {content.trialNote}
    </Link>
  );

  const eyebrow = (
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
      {content.eyebrow}
    </p>
  );

  const appIcon = (size: number) => (
    <Image
      src={site.brand.logoSrc}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-[10px]"
      style={{ width: size, height: size }}
    />
  );

  if (isBand) {
    return (
      <aside
        id={id}
        className={cn(
          "mx-auto overflow-hidden rounded-[30px] px-6 py-8 sm:px-10 sm:py-10",
          panelClasses,
          className,
        )}
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              {appIcon(36)}
              {eyebrow}
            </div>
            <h2 className="mt-4 text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              {slot.heading}
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-white/85">
              {slot.body}
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            {downloadButton}
            {trialNote}
            {showHomebrew ? (
              <HomebrewCommand
                command={content.homebrewCommand}
                copyLabel={content.copyLabel}
                copiedLabel={content.copiedLabel}
                placement={placement}
                tone="inverted"
                className="mt-0"
              />
            ) : null}
            {showDirectDownload ? (
              <p className="text-xs leading-5 text-white/55">
                {content.requirement}
              </p>
            ) : null}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      id={id}
      className={cn("rounded-[24px]", isRail ? "p-5" : "p-6", panelClasses, className)}
    >
      <div className="flex items-center gap-3">
        {appIcon(isRail ? 28 : 36)}
        {eyebrow}
      </div>
      <p
        className={cn(
          "mt-4 font-semibold tracking-[-0.02em]",
          isRail ? "text-[15px] leading-snug" : "text-lg leading-tight",
        )}
      >
        {slot.heading}
      </p>
      <p
        className={cn(
          "mt-2 text-white/85",
          isRail ? "text-[13px] leading-5" : "text-sm leading-6",
        )}
      >
        {slot.body}
      </p>
      <div className="mt-5 flex flex-col items-start gap-3">
        {downloadButton}
        {trialNote}
      </div>
    </aside>
  );
}
