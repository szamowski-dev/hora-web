"use client";

import { useEffect, useRef, useState } from "react";
import { ShareIcon } from "@/components/ui/blog-icons";
import { track } from "@/lib/analytics";

export function ShareButton({
  title,
  text,
  url,
}: {
  title: string;
  text: string;
  url: string;
}) {
  const [fallbackCopied, setFallbackCopied] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    },
    [],
  );

  function showFallbackCopiedState() {
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }
    setFallbackCopied(true);
    resetTimerRef.current = window.setTimeout(
      () => setFallbackCopied(false),
      2200,
    );
  }

  async function copyFallback() {
    try {
      await navigator.clipboard.writeText(url);
      track("blog_share_click", { method: "clipboard" });
      showFallbackCopiedState();
      return;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const didCopy = document.execCommand("copy");
      textarea.remove();

      if (didCopy) {
        track("blog_share_click", { method: "clipboard_fallback" });
        showFallbackCopiedState();
      }
    }
  }

  async function sharePost() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        track("blog_share_click", { method: "native" });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    await copyFallback();
  }

  return (
    <button
      type="button"
      onClick={sharePost}
      className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-section"
      aria-live="polite"
    >
      <ShareIcon className="h-3.5 w-3.5" />
      {fallbackCopied ? "Link copied" : "Share"}
    </button>
  );
}
