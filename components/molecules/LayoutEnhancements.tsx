"use client";

import { AnalyticsDelegates } from "@/components/molecules/AnalyticsDelegates";
import { AttributionHandoff } from "@/components/molecules/AttributionHandoff";
import { DeferredInteractionEnhancements } from "@/components/molecules/DeferredInteractionEnhancements";
import { Suspense } from "react";

export function LayoutEnhancements() {
  return (
    <>
      <AnalyticsDelegates />
      <Suspense fallback={null}>
        <AttributionHandoff />
      </Suspense>
      <DeferredInteractionEnhancements />
    </>
  );
}
