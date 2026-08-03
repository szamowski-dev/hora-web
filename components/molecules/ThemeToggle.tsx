"use client";

import { useEffect, useSyncExternalStore } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { cn } from "@/lib/cn";

const themeStorageKey = "hora-theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function getStoredTheme(): Theme {
  return window.localStorage.getItem(themeStorageKey) === "dark"
    ? "dark"
    : "light";
}

function getDefaultTheme(): Theme {
  return "light";
}

function subscribeToThemeChange(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("hora-theme-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("hora-theme-change", callback);
  };
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(
    subscribeToThemeChange,
    getStoredTheme,
    getDefaultTheme,
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";

    window.localStorage.setItem(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new Event("hora-theme-change"));
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-overlay-strong hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
    >
      {isLight ? (
        <MdDarkMode aria-hidden="true" className="size-5" />
      ) : (
        <MdLightMode aria-hidden="true" className="size-5" />
      )}
      <span className="sr-only">
        {isLight ? "Switch to dark mode" : "Switch to light mode"}
      </span>
    </button>
  );
}
