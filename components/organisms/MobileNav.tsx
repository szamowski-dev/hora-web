"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { Icon } from "@/components/atoms/Icon";
import { Logo } from "@/components/atoms/Logo";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";

const toggleId = "mobile-navigation-toggle";

export function MobileNav({ activePath }: { activePath?: string }) {
  const toggleRef = useRef<HTMLInputElement>(null);

  function closeMenu() {
    if (toggleRef.current) toggleRef.current.checked = false;
  }

  function toggleFromKeyboard(event: React.KeyboardEvent<HTMLLabelElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (toggleRef.current) toggleRef.current.checked = !toggleRef.current.checked;
  }

  return (
    <div className="lg:hidden">
      <input
        ref={toggleRef}
        id={toggleId}
        type="checkbox"
        className="peer sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      <label
        htmlFor={toggleId}
        role="button"
        tabIndex={0}
        aria-label="Open menu"
        aria-controls="mobile-navigation"
        onKeyDown={toggleFromKeyboard}
        className="absolute right-4 top-1.5 z-20 inline-flex h-11 w-11 cursor-pointer touch-manipulation items-center justify-center rounded-md text-text transition-colors hover:bg-overlay-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:top-2.5 md:right-6"
      >
        <Icon name="menu" size={24} className="pointer-events-none" />
      </label>

      <div
        id="mobile-navigation"
        className="fixed inset-0 z-[100] hidden min-h-dvh flex-col overflow-y-auto overscroll-contain bg-bg/96 backdrop-blur-2xl peer-checked:flex"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="ui-panel mx-3 mt-3 flex h-14 shrink-0 items-center justify-between rounded-[20px] px-4 shadow-[0_16px_42px_-24px_oklch(0_0_0/0.9)] md:mx-6 md:h-16 md:rounded-[22px] md:px-6">
          <Logo className="min-h-10" />
          <label
            htmlFor={toggleId}
            role="button"
            tabIndex={0}
            aria-label="Close menu"
            onKeyDown={toggleFromKeyboard}
            className="inline-flex h-11 w-11 cursor-pointer touch-manipulation items-center justify-center rounded-md text-text transition-colors hover:bg-overlay-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:-mr-px"
          >
            <Icon name="close" size={24} className="pointer-events-none" />
          </label>
        </div>

        <div className="flex flex-col gap-2 px-6 pb-8 pt-4">
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
                "border-b border-border py-3 text-lg transition-colors focus-visible:outline-none focus-visible:text-accent",
                activePath === item.href
                  ? "text-text"
                  : "text-muted hover:text-text",
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex items-center">
            <AppStoreLink
              href={site.cta.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={site.cta.primary.label}
              onClick={closeMenu}
              {...analyticsAttrs("app_store_cta_click", {
                placement: ANALYTICS_PLACEMENTS.nav,
                destination: "mac_app_store",
              })}
              className="app-store-interactive inline-flex h-12 shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Image
                src={site.macAppStoreBadgeSrc}
                alt={site.cta.primary.label}
                width={162}
                height={50}
                className="h-12 w-auto"
              />
            </AppStoreLink>
          </div>
        </div>
      </div>
    </div>
  );
}
