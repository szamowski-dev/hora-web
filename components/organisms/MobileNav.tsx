"use client";

import { useRef } from "react";
import Link from "next/link";
import { MdClose, MdMenu } from "react-icons/md";
import { Logo } from "@/components/atoms/Logo";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { analyticsAttrs } from "@/lib/analyticsAttrs";

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
    <div className="md:hidden">
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
        className="absolute right-2 top-1.5 z-20 inline-flex size-11 cursor-pointer touch-manipulation items-center justify-center rounded-full text-text transition-colors hover:bg-overlay-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:right-4 md:top-2.5"
      >
        <MdMenu aria-hidden="true" className="size-6" />
      </label>

      <div
        id="mobile-navigation"
        className="fixed inset-0 z-[100] hidden min-h-dvh flex-col overflow-y-auto overscroll-contain bg-bg/96 backdrop-blur-2xl peer-checked:flex"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="landing-glass mx-3 mt-3 flex h-14 shrink-0 items-center justify-between rounded-[18px] px-4 md:mx-6 md:h-16 md:px-6">
          <Logo className="min-h-10" />
          <label
            htmlFor={toggleId}
            role="button"
            tabIndex={0}
            aria-label="Close menu"
            onKeyDown={toggleFromKeyboard}
            className="inline-flex size-11 cursor-pointer touch-manipulation items-center justify-center rounded-full text-text transition-colors hover:bg-overlay-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <MdClose aria-hidden="true" className="size-6" />
          </label>
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
          <Button asChild size="lg" className="mt-7 w-full">
            <Link
              href={site.cta.trial.href}
              onClick={closeMenu}
              {...analyticsAttrs("nav_click", {
                link_text: site.cta.trial.label,
                link_url: site.cta.trial.href,
              })}
            >
              {site.cta.trial.label}
            </Link>
          </Button>
          <p className="mt-3 text-center text-xs text-muted">
            Requires macOS 26 or newer
          </p>
        </div>
      </div>
    </div>
  );
}
