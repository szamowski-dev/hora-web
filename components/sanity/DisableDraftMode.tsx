"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();

  if (isPresentationTool) {
    return null;
  }

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed right-4 bottom-4 z-[120] inline-flex min-h-11 items-center rounded-full border border-line-strong bg-panel-deep px-4 text-sm font-medium text-text shadow-xl transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
    >
      Exit preview
    </a>
  );
}
