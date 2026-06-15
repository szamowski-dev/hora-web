"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";

const TESTFLIGHT_HOST = "testflight.apple.com";
const OPEN_DELAY_SECONDS = 3;

type PendingOpen = {
  href: string;
};

function isPrimaryUnmodifiedClick(event: MouseEvent) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

function isTestFlightLink(anchor: HTMLAnchorElement) {
  try {
    return new URL(anchor.href).hostname === TESTFLIGHT_HOST;
  } catch {
    return false;
  }
}

export function TestFlightDiscordPrompt() {
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OPEN_DELAY_SECONDS);
  const pendingOpenRef = useRef<PendingOpen | null>(null);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
  }, []);

  const openPendingTestFlight = useCallback((source: "auto" | "manual") => {
    const pending = pendingOpenRef.current;
    if (!pending) return;

    clearTimers();
    setSecondsLeft(0);
    track("testflight_cta_click", {
      placement: "testflight_prompt",
      destination: "testflight",
      trigger: source,
    });
    track(
      source === "auto" ? "testflight_delayed_open" : "testflight_manual_open",
      {
        destination: "testflight",
        delay_seconds: OPEN_DELAY_SECONDS,
        location: "testflight_prompt",
      },
    );

    window.open(pending.href, "_blank", "noopener,noreferrer");
    pendingOpenRef.current = null;
  }, [clearTimers]);

  function trackDiscordClick() {
    const props = {
      location: "testflight_prompt",
      source: "testflight_modal",
    };

    track("discord_click", props);
    track("testflight_prompt_discord_click", props);
  }

  useEffect(() => {
    function scheduleTestFlightOpen() {
      clearTimers();
      setSecondsLeft(OPEN_DELAY_SECONDS);

      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((current) => Math.max(0, current - 1));
      }, 1000);

      timerRef.current = window.setTimeout(() => {
        openPendingTestFlight("auto");
      }, OPEN_DELAY_SECONDS * 1000);
    }

    function onClick(event: MouseEvent) {
      if (!isPrimaryUnmodifiedClick(event)) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.<HTMLAnchorElement>("a[href]");
      if (!anchor || !isTestFlightLink(anchor)) return;
      if (anchor.dataset.testflightPromptSkip === "true") return;

      event.preventDefault();

      pendingOpenRef.current = {
        href: anchor.href,
      };

      setOpen(true);
      track("testflight_discord_prompt_view", {
        destination: "testflight",
        delay_seconds: OPEN_DELAY_SECONDS,
      });
      scheduleTestFlightOpen();
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      clearTimers();
    };
  }, [clearTimers, openPendingTestFlight]);

  useEffect(() => {
    if (!open) return;

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="testflight-discord-title"
      className="fixed inset-0 z-70 flex items-center justify-center overflow-hidden bg-[radial-gradient(900px_520px_at_50%_35%,rgba(255,56,60,0.20),transparent_66%),linear-gradient(180deg,rgba(0,0,0,0.62),rgba(0,0,0,0.82))] px-4 py-6 backdrop-blur-lg"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-90 w-90 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/18 blur-3xl" />
      <div className="relative w-full max-w-125 overflow-hidden rounded-2xl border border-white/18 bg-white/7.5 p-5 text-left shadow-[0_40px_110px_-44px_rgba(255,56,60,0.85),0_24px_80px_-48px_rgba(255,255,255,0.48),inset_0_1px_0_rgba(255,255,255,0.32),inset_0_-1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl sm:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.24),rgba(255,255,255,0.05)_34%,rgba(255,255,255,0.02)_64%,rgba(255,255,255,0.12))]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white/70 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#5865F2]/22 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-accent/22 blur-3xl"
        />

        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/6 text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-colors hover:bg-white/12 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Icon name="close" size={20} />
        </button>

        <div
          aria-hidden
          className="absolute inset-x-0 top-0 z-10 h-1 bg-white/10"
        >
          <div
            className="h-full bg-linear-to-r from-accent via-[#ff7a76] to-white/80 transition-[width] duration-1000 ease-linear"
            style={{
              width: `${Math.max(0, (secondsLeft / OPEN_DELAY_SECONDS) * 100)}%`,
            }}
          />
        </div>

        <div className="relative z-10">
          <div className="mb-6 flex items-center pr-12">
            <div className="rounded-full border border-white/12 bg-white/5.5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
              Beta feedback
            </div>
          </div>

          <h2
            id="testflight-discord-title"
            className="max-w-92 text-2xl font-semibold leading-[1.16] tracking-tight text-text sm:text-[27px]"
          >
            TestFlight opens in a moment. Join the hora Discord too.
          </h2>
          <p className="mt-3 max-w-100 text-sm leading-6 text-white/68 sm:text-[15px]">
            That is where beta feedback turns into fixes fastest, with build
            notes, known issues, and quick answers between releases.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={site.community.discord.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackDiscordClick}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-5 text-sm font-semibold text-white shadow-[0_18px_48px_-24px_rgba(88,101,242,0.95),inset_0_1px_0_rgba(255,255,255,0.26)] transition-colors hover:bg-[#6975ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8790ff]"
            >
              <Icon name="discord" size={18} />
              Join Discord
            </a>
            <button
              type="button"
              data-testflight-prompt-skip="true"
              onClick={() => openPendingTestFlight("manual")}
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/16 bg-white/[0.07] px-5 text-sm font-semibold text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-colors hover:border-white/28 hover:bg-white/11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Open TestFlight now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
