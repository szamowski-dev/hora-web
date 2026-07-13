"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  buildAttributedAppStoreHref,
  hasUtmAttribution,
  utmAttributionFromSearchParams,
  type UtmAttribution,
} from "@/lib/appStoreCampaign";

const APP_STORE_UTM_STORAGE_KEY = "hora_app_store_utm_v1";
const APP_STORE_UTM_EVENT = "hora:app-store-utm-change";

type AppStoreLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
};

function getStoredAttributionSnapshot() {
  try {
    return window.sessionStorage.getItem(APP_STORE_UTM_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function getServerAttributionSnapshot() {
  return "";
}

function subscribeToStoredAttribution(onStoreChange: () => void) {
  window.addEventListener(APP_STORE_UTM_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(APP_STORE_UTM_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function parseStoredAttribution(value: string): UtmAttribution | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as UtmAttribution;
  } catch {
    return null;
  }
}

function storeAttribution(attribution: UtmAttribution) {
  try {
    const value = JSON.stringify(attribution);
    if (window.sessionStorage.getItem(APP_STORE_UTM_STORAGE_KEY) === value) {
      return;
    }

    window.sessionStorage.setItem(APP_STORE_UTM_STORAGE_KEY, value);
    window.dispatchEvent(new Event(APP_STORE_UTM_EVENT));
  } catch {
    // Storage can be unavailable in private browsing. The current URL still works.
  }
}

function AttributedAppStoreLink({ href, ...props }: AppStoreLinkProps) {
  const searchParams = useSearchParams();
  const currentAttribution = useMemo(
    () => utmAttributionFromSearchParams(searchParams),
    [searchParams],
  );
  const storedAttributionSnapshot = useSyncExternalStore(
    subscribeToStoredAttribution,
    getStoredAttributionSnapshot,
    getServerAttributionSnapshot,
  );
  const storedAttribution = useMemo(
    () => parseStoredAttribution(storedAttributionSnapshot),
    [storedAttributionSnapshot],
  );

  useEffect(() => {
    if (hasUtmAttribution(currentAttribution)) {
      storeAttribution(currentAttribution);
    }
  }, [currentAttribution]);

  const attribution = hasUtmAttribution(currentAttribution)
    ? currentAttribution
    : storedAttribution;
  const attributedHref = attribution
    ? buildAttributedAppStoreHref(href, attribution)
    : href;

  return <a href={attributedHref} {...props} />;
}

export function AppStoreLink({ href, ...props }: AppStoreLinkProps) {
  return (
    <Suspense fallback={<a href={href} {...props} />}>
      <AttributedAppStoreLink href={href} {...props} />
    </Suspense>
  );
}
