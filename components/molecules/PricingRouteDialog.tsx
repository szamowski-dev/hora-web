"use client";

import { useRouter } from "next/navigation";
import {
  PRICING_SUMMARY,
  PricingSection,
} from "@/components/organisms/PricingSection";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HomePageContent } from "@/lib/home-model";

export function PricingRouteDialog({
  content,
}: {
  content: HomePageContent["pricing"];
}) {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={(open) => (open ? undefined : router.back())}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto p-5 sm:!max-w-5xl sm:p-8">
        <DialogHeader className="pr-12 text-left">
          <DialogTitle className="text-3xl tracking-[-0.04em] sm:text-4xl">
            {content.titlePrefix} {content.titleAccent}
          </DialogTitle>
          <DialogDescription className="max-w-2xl text-base leading-7 text-muted">
            {PRICING_SUMMARY}
          </DialogDescription>
        </DialogHeader>
        <PricingSection content={content} compact />
      </DialogContent>
    </Dialog>
  );
}
