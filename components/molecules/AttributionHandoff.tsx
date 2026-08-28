"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  recordAttributionPageView,
} from "@/lib/attribution-handoff";
import {
  ANALYTICS_CONSENT_CHANGED_EVENT,
} from "@/lib/cookie-consent";

export function AttributionHandoff() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    const path = search ? `${pathname}?${search}` : pathname;
    const recordCurrentPage = () => recordAttributionPageView(path);

    recordCurrentPage();
    window.addEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, recordCurrentPage);
    return () =>
      window.removeEventListener(
        ANALYTICS_CONSENT_CHANGED_EVENT,
        recordCurrentPage,
      );
  }, [pathname, search]);
  return null;
}
