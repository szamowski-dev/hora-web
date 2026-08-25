"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";

type ShaderCanvasComponent = ComponentType;

function supportsWebGL2() {
  try {
    return document.createElement("canvas").getContext("webgl2") !== null;
  } catch {
    return false;
  }
}

export function ProductHeroShaderMotion() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [Canvas, setCanvas] = useState<ShaderCanvasComponent | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const desktop = window.matchMedia("(min-width: 768px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const webGL2Available = supportsWebGL2();
    let isIntersecting = true;
    let disposed = false;
    let loadVersion = 0;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof globalThis.setTimeout> | undefined;

    const cancelScheduledLoad = () => {
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) globalThis.clearTimeout(timeoutId);
      idleId = undefined;
      timeoutId = undefined;
    };

    const shouldAnimate = () =>
      desktop.matches &&
      !reducedMotion.matches &&
      webGL2Available &&
      isIntersecting &&
      document.visibilityState === "visible";

    const loadShader = (version: number) => {
      void import("@/components/organisms/ProductHeroShaderCanvas")
        .then((module) => {
          if (disposed || version !== loadVersion || !shouldAnimate()) return;
          setCanvas(() => module.ProductHeroShaderCanvas);
        })
        .catch(() => {
          if (disposed || version !== loadVersion) return;
          setCanvas(null);
        });
    };

    const update = () => {
      cancelScheduledLoad();
      loadVersion += 1;

      if (!shouldAnimate()) {
        setCanvas(null);
        return;
      }

      const version = loadVersion;
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => loadShader(version), {
          timeout: 900,
        });
      } else {
        timeoutId = globalThis.setTimeout(() => loadShader(version), 120);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        update();
      },
      { rootMargin: "160px 0px" },
    );

    observer.observe(host);
    desktop.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();

    return () => {
      disposed = true;
      cancelScheduledLoad();
      observer.disconnect();
      desktop.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="absolute inset-y-0 -inset-x-[20%] hidden opacity-30 md:block"
    >
      {Canvas ? <Canvas /> : null}
    </div>
  );
}
