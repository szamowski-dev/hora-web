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
  identify,
  redditIdentify,
  redditTrack,
  track,
  trackConversion,
} from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { normalizeEmail } from "@/lib/identity";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm({ className }: { className?: string }) {
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
    track("newsletter_submit", { method: "email", ...attribution });

    try {
      const res = await fetch(site.newsletter.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setMessage(site.newsletter.afterSignup.title);
      identify(normalizedEmail, {
        email: normalizedEmail,
        newsletter_joined_at: new Date().toISOString(),
        ...attribution,
      });
      track("newsletter_form_success", { method: "email", ...attribution });
      trackConversion(CONVERSION_TAGS.waitlistSignup);
      redditIdentify(normalizedEmail).then(() => {
        redditTrack("SignUp");
      });
    } catch {
      setStatus("error");
      setMessage(
        `Something went wrong. Try again or email ${site.contactEmail}.`,
      );
      track("newsletter_signup_error", { method: "email", ...attribution });
    }
  }

  async function onShare() {
    const { shareText, shareUrl } = site.newsletter.afterSignup;
    const attribution = getAttribution();
    track("post_signup_share_click", { method: "native_or_clipboard", ...attribution });

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
      ...getAttribution(),
    });
  }

  const hero = home.hero.newsletter;
  const afterSignup = site.newsletter.afterSignup;

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
            placeholder={hero.placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "submitting"}
            className="h-14 rounded-md border-white/10 bg-bg/85 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] focus-visible:border-white/30 focus-visible:ring-white/20"
          />
          <Button
            type="submit"
            size="lg"
            disabled={status === "submitting"}
            className="h-14 w-full shrink-0 rounded-md bg-accent px-7 text-base font-semibold text-white shadow-[0_16px_40px_-18px_rgba(255,56,60,0.9),inset_0_1px_0_rgba(255,255,255,0.22)] transition-colors hover:bg-accent-hover sm:w-auto sm:min-w-[15rem]"
          >
            {status === "submitting" ? (
              "Sending…"
            ) : (
              <>
                <Icon name="mail" size={16} />
                {hero.button}
              </>
            )}
          </Button>
        </form>
      ) : null}

      {status === "success" ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-emerald-400/20 bg-emerald-400/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-300/10 text-emerald-300">
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
              className="discord-cta-button h-11 rounded-md border border-[#5865F2]/45 bg-[#5865F2]/12 px-5 text-[#cfd3ff] transition-colors hover:bg-[#5865F2]/18 hover:text-white focus-visible:ring-[#5865F2]"
            >
              <Icon name="discord" size={16} />
              {afterSignup.discordLabel}
            </Button>
            <button
              type="button"
              onClick={onShare}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/12 px-4 text-sm font-medium text-text transition-colors hover:border-white/24 hover:bg-white/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
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
