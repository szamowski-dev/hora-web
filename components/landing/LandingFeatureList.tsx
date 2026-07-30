import type { IconType } from "react-icons";
import {
  MdAccountCircle,
  MdApps,
  MdAutoAwesome,
  MdBeachAccess,
  MdBrightness6,
  MdCalendarMonth,
  MdCenterFocusStrong,
  MdContacts,
  MdDragIndicator,
  MdEvent,
  MdKey,
  MdKeyboard,
  MdLanguage,
  MdLabelOutline,
  MdMapsHomeWork,
  MdMarkEmailUnread,
  MdMemory,
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
  MdWebAsset,
  MdWidgets,
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
  "menu-bar": MdWebAsset,
  timer: MdTimer,
  "auto-awesome": MdAutoAwesome,
  tasks: MdChecklist,
  "focus-time": MdCenterFocusStrong,
  availability: MdCalendarMonth,
  widgets: MdWidgets,
  sync: MdSync,
  key: MdKey,
  storage: MdStorage,
  speed: MdSpeed,
  notifications: MdNotificationsNone,
  dock: MdApps,
  keyboard: MdKeyboard,
  windows: MdWindow,
  "dark-mode": MdBrightness6,
  "apple-silicon": MdMemory,
  view: MdViewWeek,
  drag: MdDragIndicator,
  "quick-add": MdLanguage,
  "time-zone": MdPublic,
  repeat: MdRepeat,
  location: MdMapsHomeWork,
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
          ? "gap-x-11 gap-y-10 sm:gap-y-11 lg:gap-x-16"
          : prominent
            ? "gap-x-11 gap-y-13 md:gap-y-16 lg:gap-x-13"
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
              prominent ? "max-w-none gap-4" : "max-w-sm gap-3",
            )}
          >
            <div
              className={cn(
                "flex",
                titleOnly || prominent
                  ? "flex-row items-center gap-4"
                  : "flex-col items-start gap-3",
              )}
            >
              <FeatureIcon
                aria-hidden="true"
                className={cn(
                  titleOnly || prominent
                    ? "size-9 shrink-0"
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
                    ? "flex min-h-9 items-center text-[1.35rem] leading-none sm:text-[1.4rem]"
                    : prominent
                      ? "text-base sm:text-[1.2rem]"
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
                    ? "text-[0.9rem] leading-[1.4rem] text-text/90"
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
