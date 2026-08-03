"use client";

import { useEffect, useRef, useState } from "react";
import { MdCheck, MdContentCopy, MdTerminal } from "react-icons/md";
import { Button } from "@/components/ui/button";
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
      className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full [corner-shape:superellipse(1.6)] border border-line-strong bg-panel-deep/80 py-1.5 pl-4 pr-1.5 text-left shadow-[inset_0_1px_0_var(--ui-highlight)]"
    >
      <MdTerminal aria-hidden="true" className="size-5 shrink-0 text-accent" />
      <code className="truncate text-xs text-text sm:text-sm">
        <span aria-hidden="true" className="text-muted">
          ${" "}
        </span>
        {command}
      </code>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={copyCommand}
        {...analyticsAttrs(ANALYTICS_EVENTS.brewCopyClick, {
          command_type: "homebrew",
          placement: ANALYTICS_PLACEMENTS.hero,
        })}
        aria-label={copied ? copiedLabel : copyLabel}
        className="shrink-0"
      >
        {copied ? (
          <MdCheck data-icon="inline-start" aria-hidden="true" />
        ) : (
          <MdContentCopy data-icon="inline-start" aria-hidden="true" />
        )}
        {copied ? copiedLabel : copyLabel}
      </Button>
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </div>
  );
}
