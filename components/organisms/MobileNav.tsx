"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { MdClose, MdMenu } from "react-icons/md";
import { Logo } from "@/components/atoms/Logo";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_EVENTS } from "@/lib/analyticsSchema";
import {
  DIRECT_DOWNLOAD_HREF,
  DIRECT_DOWNLOAD_LABEL,
} from "@/lib/direct/commerce-contract";

const toggleId = "mobile-navigation-toggle";

export function MobileNav({
  activePath,
  showDirectDownload = false,
}: {
  activePath?: string;
  showDirectDownload?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="xl:hidden">
      <input
        id={toggleId}
        type="checkbox"
        className="peer sr-only"
        aria-hidden="true"
        tabIndex={-1}
        checked={isOpen}
        readOnly
      />

      <button
        type="button"
        aria-label="Open menu"
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="absolute right-2 top-1.5 z-20 inline-flex size-11 cursor-pointer touch-manipulation items-center justify-center rounded-full text-text transition-colors hover:bg-overlay-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:right-4 md:top-2.5"
      >
        <MdMenu aria-hidden="true" className="size-6" />
      </button>

      <div
        id="mobile-navigation"
        className="fixed inset-0 z-[100] hidden min-h-dvh flex-col overflow-y-auto overscroll-contain bg-bg/96 backdrop-blur-2xl peer-checked:flex"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div
          className="landing-glass mx-3 mt-3 flex h-14 shrink-0 items-center justify-between rounded-[18px] px-4 md:mx-6 md:h-16 md:px-6"
          style={{ background: "var(--ui-panel)" }}
        >
          <Logo className="min-h-10" />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
              className="inline-flex size-11 cursor-pointer touch-manipulation items-center justify-center rounded-full text-text transition-colors hover:bg-overlay-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <MdClose aria-hidden="true" className="size-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1 px-6 pb-10 pt-8">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              {...analyticsAttrs("nav_click", {
                link_text: item.label,
                link_url: item.href,
              })}
              className={cn(
                "border-b border-line py-4 text-2xl font-medium tracking-tight focus-visible:outline-none focus-visible:text-accent",
                activePath === item.href
                  ? "text-text"
                  : "text-muted transition-colors hover:text-text",
              )}
            >
              {item.label}
            </Link>
          ))}
          {showDirectDownload ? (
            <Button asChild size="lg" className="mt-7 w-full">
              <Link
                href={DIRECT_DOWNLOAD_HREF}
                onClick={closeMenu}
                {...analyticsAttrs(ANALYTICS_EVENTS.directDownloadClick, {
                  link_text: DIRECT_DOWNLOAD_LABEL,
                  link_url: DIRECT_DOWNLOAD_HREF,
                  placement: "mobile_nav",
                })}
              >
                {DIRECT_DOWNLOAD_LABEL}
              </Link>
            </Button>
          ) : (
            <AppStoreLink
              href={site.cta.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              aria-label={site.cta.primary.label}
              className="app-store-interactive mt-7 inline-flex h-12 self-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              {...analyticsAttrs("app_store_cta_click", {
                placement: "nav",
                destination: "mac_app_store",
              })}
            >
              <Image
                src={site.macAppStoreBadgeSrc}
                alt={site.cta.primary.label}
                width={162}
                height={50}
                className="h-12 w-auto"
              />
            </AppStoreLink>
          )}
        </div>
      </div>
    </div>
  );
}
