"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export function GoogleAnalyticsPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPageRef = useRef<string | null>(null);
  const search = searchParams.toString();
  const pagePath = search ? `${pathname}?${search}` : pathname;

  useEffect(() => {
    if (previousPageRef.current === pagePath) return;
    previousPageRef.current = pagePath;
    trackPageView(pagePath);
  }, [pagePath]);

  return null;
}
