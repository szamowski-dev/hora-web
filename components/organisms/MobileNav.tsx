"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
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
        <div className="mt-2 flex items-center gap-3">
          <a
            href={site.cta.primary.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={site.cta.primary.label}
            onClick={() => setOpen(false)}
            {...analyticsAttrs("app_store_cta_click", {
              placement: "nav_mobile",
              destination: "mac_app_store",
            })}
            className="inline-flex h-12 shrink-0 items-center rounded-lg transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <Image
              src={site.macAppStoreBadgeSrc}
              alt={site.cta.primary.label}
              width={162}
              height={50}
              className="h-12 w-auto"
            />
          </a>
          <a
            href={site.community.discord.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={site.community.discord.label}
            onClick={() => setOpen(false)}
            {...analyticsAttrs("discord_click", { location: "mobile_menu" })}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-white/12 bg-white/2 text-text transition-colors hover:border-[#5865F2]/50 hover:bg-[#5865F2]/15 hover:text-[#5865F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5865F2] focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <Icon name="discord" size={20} />
          </a>
        </div>
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
