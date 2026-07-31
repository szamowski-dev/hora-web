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
      <DialogContent className="p-5 sm:!max-w-4xl sm:p-6 sm:has-[details[open]]:max-h-[92dvh] sm:has-[details[open]]:overflow-y-auto">
        <DialogHeader className="pr-12 text-left sm:[zoom:0.9]">
          <DialogTitle className="text-3xl tracking-[-0.04em] sm:text-[2rem]">
            {content.titlePrefix} {content.titleAccent}
          </DialogTitle>
          <DialogDescription className="max-w-2xl text-base leading-7 text-muted">
            {PRICING_SUMMARY}
          </DialogDescription>
        </DialogHeader>
        <div className="sm:[zoom:0.78]">
          <PricingSection content={content} compact />
        </div>
      </DialogContent>
    </Dialog>
  );
}
