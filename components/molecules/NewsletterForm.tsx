"use client";

import { useId, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Icon } from "@/components/atoms/Icon";
import { site } from "@/content/site";
import { home } from "@/content/home";
import {
  CONVERSION_TAGS,
  getAttribution,
  redditIdentify,
  redditTrack,
  track,
  trackConversion,
} from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { normalizeEmail } from "@/lib/identity";
import type { NewsletterPlacement } from "@/lib/analyticsSchema";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm({
  placement,
  className,
  placeholder,
  buttonLabel,
  showButtonIcon = true,
}: {
  placement: NewsletterPlacement;
  className?: string;
  placeholder?: string;
  buttonLabel?: string;
  showButtonIcon?: boolean;
}) {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes("@")) return;
    const normalizedEmail = normalizeEmail(email);

    setStatus("submitting");
    setMessage("");
    const attribution = getAttribution();
    track("newsletter_submit", { method: "email", placement, ...attribution });

    try {
      const res = await fetch(site.newsletter.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setMessage(site.newsletter.afterSignup.title);
      track("newsletter_form_success", {
        method: "email",
        placement,
        ...attribution,
      });
      trackConversion(CONVERSION_TAGS.waitlistSignup);
      redditIdentify(normalizedEmail).then(() => {
        redditTrack("SignUp");
      });
    } catch {
      setStatus("error");
      setMessage(
        `Something went wrong. Try again or email ${site.contactEmail}.`,
      );
      track("newsletter_signup_error", {
        method: "email",
        placement,
        ...attribution,
      });
    }
  }

  async function onShare() {
    const { shareText, shareUrl } = site.newsletter.afterSignup;
    const attribution = getAttribution();
    track("post_signup_share_click", {
      method: "native_or_clipboard",
      placement,
      ...attribution,
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: "hora Calendar beta",
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setShareState("copied");
      window.setTimeout(() => setShareState("idle"), 2200);
    } catch {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  }

  function onDiscordClick() {
    track("post_signup_discord_click", {
      method: "success_panel",
      placement,
      ...getAttribution(),
    });
  }

  const hero = home.hero.newsletter;
  const afterSignup = site.newsletter.afterSignup;
  const resolvedPlaceholder = placeholder ?? hero.placeholder;
  const resolvedButtonLabel = buttonLabel ?? hero.button;

  return (
    <div className={cn("w-full max-w-md", className)}>
      {status !== "success" ? (
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
          noValidate
        >
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <Input
            id={emailId}
            type="email"
            inputMode="email"
            autoComplete="email"
            name="email"
            required
            placeholder={resolvedPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "submitting"}
            className="h-12 rounded-md border-line bg-bg/85 text-sm shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.08)] focus-visible:border-accent/45 focus-visible:ring-accent/25"
          />
          <Button
            type="submit"
            variant="outline"
            size="lg"
            disabled={status === "submitting"}
            className="h-12 w-full shrink-0 rounded-md border-accent/50 bg-accent px-6 text-sm font-semibold text-text shadow-[0_14px_32px_-22px_oklch(0_0_0/0.94),inset_0_1px_0_oklch(0.9851_0_0/0.16)] transition-[background-color,filter] hover:bg-accent-hover hover:brightness-105 hover:saturate-110 hover:text-text sm:w-auto sm:min-w-[13.5rem]"
          >
            {status === "submitting" ? (
              "Sending…"
            ) : (
              <>
                {showButtonIcon ? <Icon name="bell" size={16} /> : null}
                {resolvedButtonLabel}
              </>
            )}
          </Button>
        </form>
      ) : null}

      {status === "success" ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-success/20 bg-success/8 p-4 shadow-[inset_0_1px_0_oklch(0.9851_0_0/0.08)]"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-success/25 bg-success/10 text-success">
              <Icon name="check" size={16} />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-text">{message}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {afterSignup.message}
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
            <Button
              href={site.community.discord.href}
              external
              onClick={onDiscordClick}
              variant="ghost"
              size="md"
              className="discord-cta-button h-11 rounded-md border border-discord-hover/45 bg-discord-hover/12 px-5 text-discord-text transition-colors hover:bg-discord-hover/18 hover:text-text focus-visible:ring-discord-hover"
            >
              <Icon name="discord" size={16} />
              {afterSignup.discordLabel}
            </Button>
            <button
              type="button"
              onClick={onShare}
              className="ui-interactive inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line-strong px-4 text-sm font-medium text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Icon name="hand-heart" size={16} />
              {shareState === "copied"
                ? afterSignup.copiedLabel
                : afterSignup.shareLabel}
            </button>
          </div>
        </div>
      ) : message ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "text-sm",
            message && "mt-3 min-h-5",
            status === "error" && "text-accent",
          )}
        >
          {message}
        </div>
      ) : null}
    </div>
  );
}
