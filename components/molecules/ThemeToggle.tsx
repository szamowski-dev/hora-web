import { MdDarkMode, MdLightMode } from "react-icons/md";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  return (
    <button
      type="button"
      data-theme-toggle
      aria-label="Switch to dark mode"
      title="Switch to dark mode"
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-overlay-strong hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
    >
      <MdDarkMode aria-hidden="true" className="theme-toggle-dark-action size-5" />
      <MdLightMode aria-hidden="true" className="theme-toggle-light-action size-5" />
      <span className="theme-toggle-label sr-only">Switch to dark mode</span>
    </button>
  );
}
