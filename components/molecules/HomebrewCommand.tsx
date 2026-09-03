"use client";

import { useEffect, useRef, useState } from "react";
import { MdCheck, MdContentCopy } from "react-icons/md";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PLACEMENTS,
  type AnalyticsPlacement,
} from "@/lib/analyticsSchema";
import { cn } from "@/lib/cn";

/**
 * `inverted` is for the always-dark panels (the Privacy card on the homepage,
 * the blog download banners), where the default `bg-bg` shell would turn white
 * in the light theme.
 */
export function HomebrewCommand({
  command,
  copyLabel,
  copiedLabel,
  placement = ANALYTICS_PLACEMENTS.hero,
  tone = "surface",
  className,
}: {
  command: string;
  copyLabel: string;
  copiedLabel: string;
  placement?: AnalyticsPlacement;
  tone?: "surface" | "inverted";
  className?: string;
}) {
  const inverted = tone === "inverted";
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    },
    [],
  );

  function showCopiedState() {
    setCopied(true);
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
  }

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      showCopiedState();
      return;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = command;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const didCopy = document.execCommand("copy");
      textarea.remove();

      if (didCopy) {
        showCopiedState();
      }
    }
  }

  return (
    <div
      aria-label={command}
      className={cn(
        "mt-5 inline-flex max-w-full items-stretch overflow-hidden rounded-[4px] border text-left font-mono",
        inverted
          ? "border-white/16 bg-black/35"
          : "border-line-strong bg-bg shadow-[inset_0_1px_0_var(--ui-highlight),0_14px_32px_-24px_var(--ui-shadow-neutral)]",
        className,
      )}
    >
      <code
        className={cn(
          "min-w-0 flex-1 truncate px-3 py-2 text-xs leading-5 sm:px-4 sm:text-sm",
          inverted ? "text-white" : "text-text",
        )}
      >
        <span aria-hidden="true" className="select-none text-success">
          $ {" "}
        </span>
        {command}
      </code>
      <button
        type="button"
        onClick={copyCommand}
        {...analyticsAttrs(ANALYTICS_EVENTS.brewCopyClick, {
          command_type: "homebrew",
          placement,
        })}
        aria-label={copied ? copiedLabel : copyLabel}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 border-l px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:px-3",
          inverted
            ? "border-white/16 text-white/70 hover:bg-white/10 hover:text-white"
            : "border-line-strong text-muted hover:bg-overlay hover:text-text",
        )}
      >
        {copied ? (
          <MdCheck data-icon="inline-start" aria-hidden="true" />
        ) : (
          <MdContentCopy data-icon="inline-start" aria-hidden="true" />
        )}
        {copied ? copiedLabel : copyLabel}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </div>
  );
}
