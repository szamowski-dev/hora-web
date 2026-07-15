import type { ReactNode, SVGProps } from "react";

import { cn } from "@/lib/cn";

export type IconName =
  | "calendar"
  | "edit"
  | "meet"
  | "keyboard"
  | "sync"
  | "users"
  | "mail"
  | "github"
  | "x"
  | "bluesky"
  | "discord"
  | "reddit"
  | "apple"
  | "shield"
  | "arrow-right"
  | "check"
  | "menu"
  | "close"
  | "app-window"
  | "bell"
  | "hand-heart"
  | "gauge"
  | "chrome"
  | "javascript";

type IconDefinition = {
  content: ReactNode;
  rendering?: "fill" | "stroke";
};

const icons: Record<IconName, IconDefinition> = {
  calendar: {
    content: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4M16 2v4M3 9h18" />
        <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" />
      </>
    ),
  },
  edit: {
    content: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
  },
  meet: {
    content: (
      <>
        <rect x="3" y="6" width="13" height="12" rx="2" />
        <path d="m16 10 5-3v10l-5-3Z" />
      </>
    ),
  },
  keyboard: {
    content: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M10 13h.01M14 13h.01M18 13h.01M7 16h10" />
      </>
    ),
  },
  sync: {
    content: (
      <>
        <path d="M20 7h-5V2" />
        <path d="M4 17h5v5" />
        <path d="M5.1 9A8 8 0 0 1 18.5 5.5L20 7M4 17l1.5 1.5A8 8 0 0 0 18.9 15" />
      </>
    ),
  },
  users: {
    content: (
      <>
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 3.1a4 4 0 0 1 0 7.8M21 21v-2a4 4 0 0 0-3-3.9" />
      </>
    ),
  },
  mail: {
    content: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
  github: {
    content: (
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    ),
  },
  x: {
    content: (
      <>
        <path d="m4 4 11.7 16H20L8.3 4Z" />
        <path d="m4 20 6.8-6.8M13.2 10.8 20 4" />
      </>
    ),
  },
  bluesky: {
    rendering: "fill",
    content: (
      <path d="M12 10.8c-1-2-3.7-5.8-6.2-7.6C3.5 1.6 2.6 1.9 2 2.2 1.3 2.6 1.2 3.8 1.2 4.5c0 .7.4 5.5.7 6.4.9 3 4 4 6.8 3.5-4.9.7-5.9 3-3.3 5.2 4.9 4.1 6.7-.9 7.2-2.4.1-.3.2-.4.4-.4s.3.1.4.4c.5 1.5 2.3 6.5 7.2 2.4 2.6-2.2 1.6-4.5-3.3-5.2 2.8.5 5.9-.5 6.8-3.5.3-.9.7-5.7.7-6.4 0-.7-.1-1.9-.8-2.3-.6-.3-1.5-.6-3.8 1-2.5 1.8-5.2 5.6-6.2 7.6Z" />
    ),
  },
  discord: {
    content: (
      <>
        <path d="M8.5 17c-1 1.4-1.6 2-2 2-1.5 0-2.8-1.7-3.5-3-.7-1.7-.5-5.8 1.5-11.5A10 10 0 0 1 9 3l1 2a12 12 0 0 1 4 0l1-2a10 10 0 0 1 4.5 1.5c2 5.7 2.2 9.8 1.5 11.5-.7 1.3-2 3-3.5 3-.4 0-1-0.6-2-2" />
        <path d="M8 12h.01M16 12h.01M7 16.5a18 18 0 0 0 10 0" />
      </>
    ),
  },
  reddit: {
    content: (
      <>
        <ellipse cx="12" cy="14" rx="7" ry="5" />
        <path d="m12 9 1-6 5 1M9 17c2 .9 4 .9 6 0M8.5 14h.01M15.5 14h.01" />
        <circle cx="19" cy="4" r="1" />
      </>
    ),
  },
  apple: {
    rendering: "fill",
    content: (
      <>
        <path d="M15.8 12.8c0-2.4 2-3.6 2.1-3.7a4.6 4.6 0 0 0-3.6-2c-1.5-.2-3 1-3.8 1-.8 0-2-1-3.3-1C5.5 7.2 4 8.1 3.1 9.6c-1.9 3.2-.5 8 1.3 10.6.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.9 3.5-.9 1.6 0 2.1.9 3.5.8 1.5 0 2.4-1.3 3.2-2.6a11.6 11.6 0 0 0 1.5-3c0 0-3.6-1.4-3.6-4.3Z" />
        <path d="M13.3 5.5a4.7 4.7 0 0 0 1.1-3.4 4.8 4.8 0 0 0-3.1 1.6 4.4 4.4 0 0 0-1.1 3.2 4 4 0 0 0 3.1-1.4Z" />
      </>
    ),
  },
  shield: {
    content: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  "arrow-right": {
    content: <path d="m9 18 6-6-6-6" />,
  },
  check: {
    content: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.2 2.2 4.8-4.8" />
      </>
    ),
  },
  menu: {
    content: <path d="M4 6h16M4 12h16M4 18h16" />,
  },
  close: {
    content: <path d="m6 6 12 12M18 6 6 18" />,
  },
  "app-window": {
    content: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 8h18M8 8v13M11 12h6M11 16h4" />
      </>
    ),
  },
  bell: {
    content: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
  },
  "hand-heart": {
    content: (
      <>
        <path d="M7 12h3l2-2 2 2h3.5a2.5 2.5 0 0 1 0 5H12" />
        <path d="M3 11h2v9H3zM5 19c3 0 4 2 7 2 2 0 6-2.5 8-4" />
        <path d="M12 8 8.8 5A2.3 2.3 0 0 1 12 1.8 2.3 2.3 0 0 1 15.2 5Z" />
      </>
    ),
  },
  gauge: {
    content: (
      <>
        <path d="M4 19a9 9 0 1 1 16 0" />
        <path d="m12 13 4-4M5.5 14h.01M12 7h.01M18.5 14h.01" />
      </>
    ),
  },
  chrome: {
    content: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 9h8.5M14.6 13.5l-4.2 7.3M9.4 13.5 5.2 6.2" />
      </>
    ),
  },
  javascript: {
    content: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 8v7.2c0 1.2-.7 1.8-1.8 1.8-.8 0-1.4-.3-1.8-.9M15 16.5c.5.4 1.1.6 1.8.6 1 0 1.7-.5 1.7-1.3 0-.7-.5-1.1-1.6-1.5-1.2-.5-1.9-1.2-1.9-2.3 0-1.3 1-2.2 2.6-2.2.8 0 1.4.2 1.8.4" />
      </>
    ),
  },
};

type Props = Omit<SVGProps<SVGSVGElement>, "ref"> & {
  name: IconName;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
};

export function Icon({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
  fill,
  stroke,
  width,
  height,
  strokeLinecap = "round",
  strokeLinejoin = "round",
  "aria-hidden": ariaHidden,
  ...rest
}: Props) {
  const { content, rendering = "stroke" } = icons[name];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width ?? size}
      height={height ?? size}
      color={color}
      fill={fill ?? (rendering === "fill" ? "currentColor" : "none")}
      stroke={stroke ?? (rendering === "stroke" ? "currentColor" : "none")}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      aria-hidden={ariaHidden ?? true}
      className={cn("flex-shrink-0 cursor-pointer", className)}
      {...rest}
    >
      {content}
    </svg>
  );
}
