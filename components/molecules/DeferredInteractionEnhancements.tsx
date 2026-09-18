"use client";

import dynamic from "next/dynamic";
import { DeferredMount } from "@/components/molecules/DeferredMount";

const SmoothAnchorScroll = dynamic(() =>
  import("@/components/molecules/SmoothAnchorScroll").then(
    (module) => module.SmoothAnchorScroll,
  ),
);
const TestFlightDiscordPrompt = dynamic(() =>
  import("@/components/molecules/TestFlightDiscordPrompt").then(
    (module) => module.TestFlightDiscordPrompt,
  ),
);
const SectionViewTracker = dynamic(() =>
  import("@/components/molecules/SectionViewTracker").then(
    (module) => module.SectionViewTracker,
  ),
);

/**
 * These document-wide helpers are useful after a page has settled, but none
 * affects the first visible content or a primary download CTA. Keeping them
 * out of the initial client chunk protects mobile main-thread time.
 */
export function DeferredInteractionEnhancements() {
  return (
    <DeferredMount timeout={4000}>
      <SmoothAnchorScroll />
      <TestFlightDiscordPrompt />
      <SectionViewTracker />
    </DeferredMount>
  );
}
