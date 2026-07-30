import type { IconType } from "react-icons";
import {
  MdAccountCircle,
  MdAddCircleOutline,
  MdApps,
  MdAutoAwesome,
  MdBeachAccess,
  MdCalendarMonth,
  MdCenterFocusStrong,
  MdContacts,
  MdDarkMode,
  MdDragIndicator,
  MdEvent,
  MdKey,
  MdKeyboard,
  MdLabelOutline,
  MdLocationOn,
  MdMarkEmailUnread,
  MdMemory,
  MdMoreHoriz,
  MdNotificationsNone,
  MdPublic,
  MdRepeat,
  MdSearch,
  MdSpeed,
  MdStorage,
  MdSync,
  MdTimer,
  MdChecklist,
  MdVideoCall,
  MdViewWeek,
  MdWindow,
} from "react-icons/md";
import type {
  ProductLandingFeature,
  ProductLandingIcon,
  ProductLandingTone,
} from "@/lib/home-model";
import { cn } from "@/lib/cn";

const icons: Record<ProductLandingIcon, IconType> = {
  label: MdLabelOutline,
  event: MdEvent,
  "video-call": MdVideoCall,
  contacts: MdContacts,
  accounts: MdAccountCircle,
  search: MdSearch,
  invitation: MdMarkEmailUnread,
  "menu-bar": MdMoreHoriz,
  timer: MdTimer,
  "auto-awesome": MdAutoAwesome,
  tasks: MdChecklist,
  "focus-time": MdCenterFocusStrong,
  availability: MdCalendarMonth,
  sync: MdSync,
  key: MdKey,
  storage: MdStorage,
  speed: MdSpeed,
  notifications: MdNotificationsNone,
  dock: MdApps,
  keyboard: MdKeyboard,
  windows: MdWindow,
  "dark-mode": MdDarkMode,
  "apple-silicon": MdMemory,
  view: MdViewWeek,
  drag: MdDragIndicator,
  "quick-add": MdAddCircleOutline,
  "time-zone": MdPublic,
  repeat: MdRepeat,
  location: MdLocationOn,
  "out-of-office": MdBeachAccess,
};

const toneClasses: Record<ProductLandingTone, string> = {
  red: "text-label-red",
  blue: "text-label-blue",
  green: "text-label-green",
  yellow: "text-label-yellow",
  purple: "text-label-purple",
  cyan: "text-label-cyan",
};

export function LandingFeatureList({
  features,
  className,
  compact = false,
  prominent = false,
  showDescriptions = true,
  titleOnly = false,
}: {
  features: ProductLandingFeature[];
  className?: string;
  compact?: boolean;
  prominent?: boolean;
  showDescriptions?: boolean;
  titleOnly?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3",
        titleOnly
          ? "gap-x-14 gap-y-12 sm:gap-y-14 lg:gap-x-20"
          : prominent
            ? "gap-x-14 gap-y-16 md:gap-y-20 lg:gap-x-16"
          : compact
            ? "gap-y-9"
            : "md:gap-y-16",
        className,
      )}
    >
      {features.map((feature) => {
        const FeatureIcon = icons[feature.icon];

        return (
          <article
            key={`${feature.icon}-${feature.title}`}
            className={cn(
              "flex flex-col items-start",
              prominent ? "max-w-none gap-5" : "max-w-sm gap-3",
            )}
          >
            <div
              className={cn(
                "flex",
                titleOnly || prominent
                  ? "flex-row items-center gap-5"
                  : "flex-col items-start gap-3",
              )}
            >
              <FeatureIcon
                aria-hidden="true"
                className={cn(
                  titleOnly || prominent
                    ? "size-11 shrink-0"
                    : compact
                      ? "size-6"
                      : "size-7",
                  toneClasses[feature.tone],
                )}
              />
              <h3
                className={cn(
                  "font-semibold tracking-tight text-text",
                  titleOnly
                    ? "text-[1.7rem] sm:text-[1.75rem]"
                    : prominent
                      ? "text-xl sm:text-2xl"
                      : "text-base",
                )}
              >
                {feature.title}
              </h3>
            </div>
            {showDescriptions ? (
              <p
                className={cn(
                  prominent
                    ? "text-lg leading-7 text-text/90"
                    : "text-sm leading-6 text-muted",
                )}
              >
                {feature.description}
              </p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
