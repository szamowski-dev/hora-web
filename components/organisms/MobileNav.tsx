"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { Logo } from "@/components/atoms/Logo";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { analyticsAttrs } from "@/lib/analyticsAttrs";

function subscribeToClientMount() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function MobileNav({ activePath }: { activePath?: string }) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    subscribeToClientMount,
    getClientSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  const panel = (
    <div
      className={cn(
        "fixed inset-0 z-50 flex-col overflow-y-auto bg-bg/85 backdrop-blur-xl md:hidden",
        open ? "flex" : "hidden",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <Logo className="min-h-12" />
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="inline-flex h-12 w-12 items-center justify-center text-text"
        >
          <Icon name="close" size={24} />
        </button>
      </div>
      <div className="flex flex-col gap-2 p-6">
        {site.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
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
        <Link
          href={site.cta.primary.href}
          target="_blank"
          rel="noopener noreferrer"
          data-scroll-align="center"
          onClick={() => setOpen(false)}
          {...analyticsAttrs("testflight_cta_click", {
            placement: "nav_mobile",
            destination: "testflight",
          })}
          className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-semibold text-white shadow-[0_16px_40px_-18px_rgba(255,56,60,0.9),inset_0_1px_0_rgba(255,255,255,0.22)] transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          {site.cta.primary.label}
          <span aria-hidden>→</span>
        </Link>
        <a
          href={site.community.discord.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          {...analyticsAttrs("discord_click", { location: "mobile_menu" })}
          className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/12 bg-white/[0.02] px-6 text-sm font-semibold text-text transition-colors hover:border-accent/40 hover:bg-white/[0.05] hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <Icon name="discord" size={18} />
          {site.community.discord.label}
        </a>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-12 w-12 items-center justify-center text-text md:hidden"
      >
        <Icon name={open ? "close" : "menu"} size={24} />
      </button>

      {mounted ? createPortal(panel, document.body) : null}
    </>
  );
}
