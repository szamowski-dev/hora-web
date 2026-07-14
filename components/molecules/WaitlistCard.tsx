import { NewsletterForm } from "@/components/molecules/NewsletterForm";
import { WaitlistImpression } from "@/components/molecules/WaitlistImpression";
import { Icon } from "@/components/atoms/Icon";
import { AnimatedCount } from "@/components/molecules/AnimatedCount";
import { cn } from "@/lib/cn";
import type { NewsletterPlacement } from "@/lib/analyticsSchema";

type Avatar = {
  src: string;
  alt: string;
};

type Props = {
  id?: string;
  placement: NewsletterPlacement;
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  subheadlineMobile?: string;
  note?: string;
  liveCount: number;
  socialLabel: string;
  avatars?: readonly Avatar[];
  className?: string;
  variant?: "default" | "hero";
  style?: React.CSSProperties;
};

export function WaitlistCard({
  id,
  placement,
  eyebrow,
  headline,
  subheadline,
  subheadlineMobile,
  note,
  liveCount,
  socialLabel,
  avatars,
  className,
  variant = "default",
  style,
}: Props) {
  const isHero = variant === "hero";
  return (
    <div
      id={id}
      style={style}
      className={cn(
        "relative w-full overflow-hidden rounded-lg border p-5 text-left shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.16),0_24px_60px_-20px_oklch(0_0_0/0.72)] md:p-6 md:backdrop-blur-2xl",
        isHero
          ? "border-line-strong bg-surface/88 shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.16),0_24px_70px_-28px_oklch(0_0_0/0.9)]"
          : "border-line bg-overlay",
        id && "scroll-mt-24",
        className,
      )}
    >
      <WaitlistImpression placement={placement} />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 -right-28 h-56 w-56"
        style={{
          background:
            "radial-gradient(circle, var(--ui-glow-cool-medium) 0%, transparent 68%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-line-strong to-transparent"
      />

      {eyebrow ? (
        <p className="relative inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_oklch(0.6532_0.2328_25.7/0.95)]" />
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "relative font-semibold leading-tight tracking-tight text-text",
          eyebrow ? "mt-4" : "",
          isHero ? "text-3xl md:text-4xl" : "text-xl md:text-2xl",
        )}
      >
        {headline}
      </h2>
      {subheadline ? (
        <p className="relative mt-2 max-w-160 text-base leading-relaxed text-muted md:text-lg">
          {subheadlineMobile ? (
            <>
              <span className="sm:hidden">{subheadlineMobile}</span>
              <span className="hidden sm:inline">{subheadline}</span>
            </>
          ) : (
            subheadline
          )}
        </p>
      ) : null}
      {note ? (
        <p className="relative mt-1 text-xs text-muted/80">{note}</p>
      ) : null}

      <div
        className={cn(
          "relative mt-5 flex items-center gap-3 rounded-md border border-line-strong bg-overlay text-accent shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.1)]",
          isHero
            ? "w-fit max-w-full px-3 py-2.5"
            : "w-full px-4 py-3",
        )}
      >
        <AvatarTicker avatars={avatars} />
        <p className="min-w-0 text-sm leading-snug text-muted">
          <span className="mr-1.5 text-base font-semibold tabular-nums text-text">
            <AnimatedCount value={liveCount} />+
          </span>
          {socialLabel}
        </p>
      </div>

      <div className="relative mt-4">
        <NewsletterForm placement={placement} className="max-w-none" />
      </div>
    </div>
  );
}

function AvatarTicker({ avatars }: { avatars?: readonly Avatar[] }) {
  const visibleAvatars = avatars?.slice(0, 5) ?? [];

  if (visibleAvatars.length === 0) {
    return (
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-bg/60">
        <Icon name="users" size={18} />
      </span>
    );
  }

  return (
    <span
      className="relative inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-line-strong bg-bg/70 shadow-[0_12px_28px_-18px_oklch(0_0_0/0.9)]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={visibleAvatars[0].src}
        alt={visibleAvatars[0].alt}
        className="absolute inset-0 h-full w-full object-cover motion-safe:opacity-0"
        loading="lazy"
        decoding="async"
      />
      {visibleAvatars.map((avatar, index) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={avatar.src}
          src={avatar.src}
          alt={avatar.alt}
          className="absolute inset-0 h-full w-full object-cover opacity-0 animate-[waitlist-avatar-cycle_15s_ease-in-out_infinite_both] motion-reduce:hidden"
          style={{ animationDelay: `${index * 3}s` }}
          loading="lazy"
          decoding="async"
        />
      ))}
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-line-strong" />
    </span>
  );
}
