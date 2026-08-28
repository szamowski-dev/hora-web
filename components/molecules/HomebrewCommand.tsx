"use client";

import { useEffect, useRef, useState } from "react";
import { MdCheck, MdContentCopy } from "react-icons/md";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PLACEMENTS,
} from "@/lib/analyticsSchema";

export function HomebrewCommand({
  command,
  copyLabel,
  copiedLabel,
}: {
  command: string;
  copyLabel: string;
  copiedLabel: string;
}) {
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
      className="mt-5 inline-flex max-w-full items-stretch overflow-hidden rounded-[4px] border border-line-strong bg-bg text-left font-mono shadow-[inset_0_1px_0_var(--ui-highlight),0_14px_32px_-24px_var(--ui-shadow-neutral)]"
    >
      <code className="min-w-0 flex-1 truncate px-3 py-2 text-xs leading-5 text-text sm:px-4 sm:text-sm">
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
          placement: ANALYTICS_PLACEMENTS.hero,
        })}
        aria-label={copied ? copiedLabel : copyLabel}
        className="inline-flex shrink-0 items-center gap-1.5 border-l border-line-strong px-2.5 text-xs font-medium text-muted transition-colors hover:bg-overlay hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:px-3"
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
