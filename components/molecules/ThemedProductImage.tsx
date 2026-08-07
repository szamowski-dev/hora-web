"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

type ThemedProductImageProps = {
  alt: string;
  className?: string;
  darkSrc: string;
  fetchPriority?: "high" | "low" | "auto";
  lightSrc: string;
  preload?: boolean;
  sizes: string;
  unoptimized?: boolean;
  width: number;
  height: number;
};

function getTheme(): Theme {
  return window.localStorage.getItem("hora-theme") === "dark" ? "dark" : "light";
}

function getServerTheme(): Theme {
  return "light";
}

function subscribeToThemeChange(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("hora-theme-change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("hora-theme-change", onStoreChange);
  };
}

export function ThemedProductImage({
  alt,
  className,
  darkSrc,
  fetchPriority,
  height,
  lightSrc,
  preload,
  sizes,
  unoptimized,
  width,
}: ThemedProductImageProps) {
  const theme = useSyncExternalStore(subscribeToThemeChange, getTheme, getServerTheme);

  return (
    <Image
      src={theme === "dark" ? darkSrc : lightSrc}
      alt={alt}
      width={width}
      height={height}
      preload={preload}
      fetchPriority={fetchPriority}
      sizes={sizes}
      unoptimized={unoptimized}
      className={className}
    />
  );
}
