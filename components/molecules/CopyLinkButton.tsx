"use client";

import { useRef, useState } from "react";
import { LinkIcon } from "@/components/ui/blog-icons";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const manualInputRef = useRef<HTMLInputElement>(null);

  function showCopiedState() {
    setManualUrl("");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 4000);
  }

  async function copyLink() {
    const url = window.location.href;
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    let didCopy = document.execCommand("copy");
    textarea.remove();

    try {
      await navigator.clipboard.writeText(url);
      didCopy = true;
    } catch {
      // The synchronous fallback above already handled restricted browsers.
    }

    if (didCopy) {
      showCopiedState();
      return;
    }

    setManualUrl(url);
    window.setTimeout(() => {
      manualInputRef.current?.focus();
      manualInputRef.current?.select();
    }, 0);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-section"
        aria-live="polite"
      >
        <LinkIcon className="h-3.5 w-3.5" />
        {copied ? "Copied" : "Copy link"}
      </button>

      {manualUrl ? (
        <div
          className="absolute left-0 top-full z-20 mt-2 w-[min(20rem,calc(100vw-3rem))] rounded-xl border border-border bg-background p-3 shadow-2xl"
          role="status"
        >
          <label
            htmlFor="manual-copy-link"
            className="mb-2 block text-xs text-muted"
          >
            Press Command-C to copy
          </label>
          <input
            ref={manualInputRef}
            id="manual-copy-link"
            value={manualUrl}
            readOnly
            onFocus={(event) => event.currentTarget.select()}
            onCopy={showCopiedState}
            className="min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-xs text-text selection:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
      ) : null}
    </div>
  );
}
