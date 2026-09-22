export const X_PIXEL_ID = "rf9ce";

type XPixelFunction = ((...args: unknown[]) => void) & {
  exe?: (...args: unknown[]) => void;
  queue?: unknown[][];
  version?: string;
};

declare global {
  interface Window {
    twq?: XPixelFunction;
  }
}

export function initializeXPixel() {
  if (typeof window === "undefined" || typeof window.twq === "function") return;

  const twq = ((...args: unknown[]) => {
    if (twq.exe) {
      twq.exe(...args);
      return;
    }
    twq.queue?.push(args);
  }) as XPixelFunction;
  twq.version = "1.1";
  twq.queue = [];
  window.twq = twq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://static.ads-twitter.com/uwt.js";
  document.head.append(script);

  twq("config", X_PIXEL_ID);
}
