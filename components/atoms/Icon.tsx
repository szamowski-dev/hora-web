"use client";

import type { ComponentType } from "react";
import AppleBrandLogo from "@/components/ui/apple-brand-logo";
import BrandChromeIcon from "@/components/ui/brand-chrome-icon";
import CheckedIcon from "@/components/ui/checked-icon";
import ClockIcon from "@/components/ui/clock-icon";
import DialpadIcon from "@/components/ui/dialpad-icon";
import DiscordIcon from "@/components/ui/discord-icon";
import GithubIcon from "@/components/ui/github-icon";
import BrandZoomIcon from "@/components/ui/brand-zoom-icon";
import JavascriptIcon from "@/components/ui/javascript-icon";
import FilledBellIcon from "@/components/ui/filled-bell-icon";
import BlueskyIcon from "@/components/ui/bluesky-icon";
import GaugeIcon from "@/components/ui/gauge-icon";
import HandHeartIcon from "@/components/ui/hand-heart-icon";
import LayoutDashboardIcon from "@/components/ui/layout-dashboard-icon";
import MailFilledIcon from "@/components/ui/mail-filled-icon";
import PenIcon from "@/components/ui/pen-icon";
import RefreshIcon from "@/components/ui/refresh-icon";
import RedditIcon from "@/components/ui/reddit-icon";
import RightChevron from "@/components/ui/right-chevron";
import ShieldCheck from "@/components/ui/shield-check";
import TwitterXIcon from "@/components/ui/twitter-x-icon";
import UnorderedListIcon from "@/components/ui/unordered-list-icon";
import UsersIcon from "@/components/ui/users-icon";
import XIcon from "@/components/ui/x-icon";
import type { AnimatedIconProps } from "@/components/ui/types";
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

type AnimatedIconComponent = ComponentType<AnimatedIconProps>;

const iconMap: Record<IconName, AnimatedIconComponent> = {
  calendar: ClockIcon,
  edit: PenIcon,
  meet: BrandZoomIcon,
  keyboard: DialpadIcon,
  sync: RefreshIcon,
  users: UsersIcon,
  mail: MailFilledIcon,
  github: GithubIcon,
  x: TwitterXIcon,
  bluesky: BlueskyIcon,
  discord: DiscordIcon,
  reddit: RedditIcon,
  apple: AppleBrandLogo,
  shield: ShieldCheck,
  "arrow-right": RightChevron,
  check: CheckedIcon,
  menu: UnorderedListIcon,
  close: XIcon,
  "app-window": LayoutDashboardIcon,
  bell: FilledBellIcon,
  "hand-heart": HandHeartIcon,
  gauge: GaugeIcon,
  chrome: BrandChromeIcon,
  javascript: JavascriptIcon,
};

type Props = AnimatedIconProps & {
  name: IconName;
  size?: number | string;
};

export function Icon({ name, size = 24, className, ...rest }: Props) {
  const Component = iconMap[name];
  return (
    <Component
      size={size}
      aria-hidden
      className={cn("flex-shrink-0", className)}
      {...rest}
    />
  );
}
