"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { MdEject, MdLaptopMac, MdOutlineHelpOutline } from "react-icons/md";
import { Annotation, HandArrow, HandLabel } from "@/components/atoms/HandArrow";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_EVENTS, ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import { cn } from "@/lib/cn";
import { DIRECT_DOWNLOAD_HREF } from "@/lib/direct/commerce-contract";

const HORA_ICON = "/assets/brand/hora-icon-512.png";
const AUTO_START_DELAY_MS = 600;

/**
 * Post-download landing page, modelled on Chrome's "thanks for downloading"
 * flow: the visit itself starts the DMG download, the page explains the
 * three install steps and mirrors the DMG background so the drag target is
 * already familiar when the disk image opens.
 */
export function DownloadThanks() {
  useEffect(() => {
    const downloadId = new URLSearchParams(window.location.search).get(
      "download_id",
    );
    const href = downloadId
      ? `${DIRECT_DOWNLOAD_HREF}?download_id=${encodeURIComponent(downloadId)}`
      : DIRECT_DOWNLOAD_HREF;
    // A navigation that resolves to a file download keeps this page in place.
    const timer = window.setTimeout(
      () => window.location.assign(href),
      AUTO_START_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="relative bg-bg px-5 pb-16 pt-32 sm:px-10 sm:pb-20 sm:pt-44">
        <Annotation className="right-12 top-24 hidden items-end gap-1 xl:flex">
          <HandLabel className="mb-1">your download is up here</HandLabel>
          <HandArrow variant="curve" className="w-20 -scale-y-100" />
        </Annotation>

        <div className="relative mx-auto flex max-w-landing flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-overlay px-3.5 py-1.5 text-sm font-medium text-muted">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            Your download has started
          </p>

          <h1 className="mt-7 text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-text sm:text-7xl">
            Thanks for downloading hora.
            <span className="block text-accent">Three steps and you’re in.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-balance text-lg leading-8 text-muted sm:text-xl">
            hora.dmg is on its way to your Downloads folder. Didn’t start?{" "}
            <a
              href={DIRECT_DOWNLOAD_HREF}
              className="font-medium text-text underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
              {...analyticsAttrs(ANALYTICS_EVENTS.directDownloadClick, {
                link_text: "Download again",
                link_url: DIRECT_DOWNLOAD_HREF,
                placement: ANALYTICS_PLACEMENTS.download,
                destination: "direct_download",
              })}
            >
              Download again
            </a>
          </p>
        </div>
      </section>

      <section className="bg-bg px-5 pb-20 sm:px-10 sm:pb-28">
        <ol className="mx-auto grid max-w-landing gap-5 lg:grid-cols-3">
          <Step
            number={1}
            title="Open hora.dmg"
            visual={<DownloadsVisual />}
          >
            Click the file in your browser’s downloads list, or find it in the
            Downloads folder in Finder.
          </Step>
          <Step
            number={2}
            title="Drag hora to Applications"
            visual={<DmgWindowVisual />}
          >
            In the window that opens, drop the hora icon onto the Applications
            folder. That’s the whole install.
          </Step>
          <Step
            number={3}
            title="Open hora and sign in"
            visual={<GatekeeperVisual />}
          >
            Launch hora from Applications or Spotlight, click Open, then sign in
            with Google. Your 7-day free trial starts right away.
          </Step>
        </ol>

        <ul className="mx-auto mt-12 grid max-w-landing gap-x-8 gap-y-6 border-t border-line pt-10 text-sm leading-6 text-muted sm:grid-cols-3">
          <Tip icon={<MdEject />} title="Tidy up afterwards">
            Eject the “hora” disk in Finder’s sidebar and move hora.dmg to the
            Trash. The app stays installed.
          </Tip>
          <Tip icon={<MdLaptopMac />} title="Requirements">
            macOS 26 Tahoe or later and a Google
            account.
          </Tip>
          <Tip icon={<MdOutlineHelpOutline />} title="Stuck somewhere?">
            Write to us via{" "}
            <Link
              href="/support/"
              className="font-medium text-text underline decoration-line-strong underline-offset-4 hover:decoration-accent"
            >
              support
            </Link>{" "}
            and a real human will get back to you.
          </Tip>
        </ul>
      </section>
    </>
  );
}

function Step({
  number,
  title,
  visual,
  children,
}: {
  number: number;
  title: string;
  visual: ReactNode;
  children: ReactNode;
}) {
  return (
    <li className="flex flex-col overflow-hidden rounded-3xl [corner-shape:superellipse(1.4)] border border-line bg-[var(--ui-panel-soft)]">
      <div
        aria-hidden="true"
        className="relative flex h-60 items-center justify-center overflow-hidden border-b border-line bg-[linear-gradient(160deg,var(--ui-glow-flow-faint),transparent_45%,var(--ui-glow-cool-faint))] px-6"
      >
        {visual}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6 sm:p-7">
        <span className="flex size-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
          {number}
        </span>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-text">
          {title}
        </h2>
        <p className="text-base leading-7 text-muted">{children}</p>
      </div>
    </li>
  );
}

function Tip({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 text-xl text-label-blue [&>svg]:size-5">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-text">{title}</p>
        <p className="mt-1">{children}</p>
      </div>
    </li>
  );
}

/** A small macOS window frame with traffic lights. */
function MacWindow({
  title,
  className,
  children,
}: {
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-line-strong bg-surface shadow-[0_24px_48px_-28px_var(--ui-shadow-neutral)]",
        className,
      )}
    >
      <div className="relative flex h-7 items-center gap-1.5 border-b border-line px-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        {title ? (
          <span className="absolute inset-x-0 text-center text-[11px] font-medium text-muted">
            {title}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function DownloadsVisual() {
  return (
    <div className="w-full max-w-[17rem] rounded-2xl border border-line-strong bg-surface p-3 text-left shadow-[0_24px_48px_-28px_var(--ui-shadow-neutral)]">
      <p className="px-1 pb-2 text-[11px] font-semibold text-muted">
        Downloads
      </p>
      <div className="flex items-center gap-3 rounded-xl bg-overlay-strong p-2.5 ring-2 ring-accent/70">
        <DiskImageIcon className="h-10 w-auto shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text">hora.dmg</p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-overlay-strong">
            <div className="h-full w-full rounded-full bg-label-blue" />
          </div>
          <p className="mt-1 text-[11px] text-muted">Done</p>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-3 p-2.5 opacity-45">
        <div className="h-10 w-8 shrink-0 rounded-md bg-overlay-strong" />
        <div className="flex-1 space-y-1.5">
          <div className="h-2 w-24 rounded-full bg-overlay-strong" />
          <div className="h-2 w-14 rounded-full bg-overlay-strong" />
        </div>
      </div>
    </div>
  );
}

/** Mirrors the DMG background: hora → hand-drawn arrow → Applications. */
function DmgWindowVisual() {
  return (
    <MacWindow title="hora" className="max-w-[19rem]">
      <div className="relative flex items-end justify-between bg-[radial-gradient(70%_80%_at_0%_100%,var(--ui-glow-flow-soft),transparent),radial-gradient(60%_80%_at_100%_100%,var(--ui-glow-cool-soft),transparent)] px-6 pb-4 pt-9">
        <figure className="flex flex-col items-center gap-1.5">
          <Image
            src={HORA_ICON}
            alt=""
            width={64}
            height={64}
            className="size-16 drop-shadow-[0_8px_14px_var(--ui-shadow-neutral)]"
          />
          <figcaption className="text-xs text-text">hora</figcaption>
        </figure>
        <div className="absolute left-1/2 top-3 flex -translate-x-1/2 flex-col items-center">
          <HandLabel className="text-base">drop it here</HandLabel>
          <HandArrow
            variant="curve"
            className="-mt-0.5 w-20 -rotate-[28deg]"
          />
        </div>
        <figure className="flex flex-col items-center gap-1.5">
          <ApplicationsFolderIcon className="size-16" />
          <figcaption className="text-xs text-text">Applications</figcaption>
        </figure>
      </div>
    </MacWindow>
  );
}

function GatekeeperVisual() {
  return (
    <div className="w-full max-w-[16rem] rounded-2xl border border-line-strong bg-surface p-4 text-center shadow-[0_24px_48px_-28px_var(--ui-shadow-neutral)]">
      <Image
        src={HORA_ICON}
        alt=""
        width={44}
        height={44}
        className="mx-auto size-11"
      />
      <p className="mt-2 text-[12px] font-semibold leading-4 text-text">
        “hora” is an app downloaded from the Internet. Are you sure you want to
        open it?
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] font-medium">
        <span className="rounded-md bg-overlay-strong py-1 text-text">
          Cancel
        </span>
        <span className="rounded-md bg-label-blue py-1 text-white ring-2 ring-accent/70 ring-offset-2 ring-offset-surface">
          Open
        </span>
      </div>
    </div>
  );
}

function DiskImageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 40" className={className} aria-hidden="true">
      <path
        d="M4 1h17l10 10v25a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z"
        fill="var(--color-surface)"
        stroke="var(--ui-line-strong)"
        strokeWidth="1.5"
      />
      <path d="M21 1v7a3 3 0 0 0 3 3h7" fill="none" stroke="var(--ui-line-strong)" strokeWidth="1.5" />
      <rect x="7" y="20" width="18" height="10" rx="2" fill="#9aa3ae" />
      <rect x="9" y="26" width="14" height="1.5" rx=".75" fill="#d9dde2" />
      <circle cx="21.5" cy="23" r="1" fill="#28c840" />
    </svg>
  );
}

function ApplicationsFolderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M4 14a4 4 0 0 1 4-4h15l5 5h28a4 4 0 0 1 4 4v33a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"
        fill="#4c9bef"
      />
      <rect x="4" y="19" width="56" height="37" rx="4" fill="#78bdfa" />
      <path
        d="M32 25.5 22.5 47h4.6l2-4.8h5.8l2 4.8h4.6Zm-1.5 12.4 1.5-3.9 1.5 3.9Z"
        fill="#3f86d6"
        opacity=".85"
      />
    </svg>
  );
}
