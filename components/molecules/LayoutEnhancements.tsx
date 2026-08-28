"use client";

import { AnalyticsDelegates } from "@/components/molecules/AnalyticsDelegates";
import { AttributionHandoff } from "@/components/molecules/AttributionHandoff";
import { DeferredMount } from "@/components/molecules/DeferredMount";
import { SectionViewTracker } from "@/components/molecules/SectionViewTracker";
import { SmoothAnchorScroll } from "@/components/molecules/SmoothAnchorScroll";
import { TestFlightDiscordPrompt } from "@/components/molecules/TestFlightDiscordPrompt";
import { Suspense } from "react";

export function LayoutEnhancements() {
  return (
    <>
      <AnalyticsDelegates />
      <Suspense fallback={null}>
        <AttributionHandoff />
      </Suspense>
      <SmoothAnchorScroll />
      <TestFlightDiscordPrompt />
      <DeferredMount timeout={4000}>
        <SectionViewTracker />
      </DeferredMount>
    </>
  );
}
