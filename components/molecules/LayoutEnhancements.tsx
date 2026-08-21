"use client";

import { AnalyticsDelegates } from "@/components/molecules/AnalyticsDelegates";
import { DeferredMount } from "@/components/molecules/DeferredMount";
import { SectionViewTracker } from "@/components/molecules/SectionViewTracker";
import { SmoothAnchorScroll } from "@/components/molecules/SmoothAnchorScroll";
import { TestFlightDiscordPrompt } from "@/components/molecules/TestFlightDiscordPrompt";

export function LayoutEnhancements() {
  return (
    <>
      <AnalyticsDelegates />
      <SmoothAnchorScroll />
      <TestFlightDiscordPrompt />
      <DeferredMount timeout={4000}>
        <SectionViewTracker />
      </DeferredMount>
    </>
  );
}
