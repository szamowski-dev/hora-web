"use client";

import { useEffect, useState, type ComponentType } from "react";

type HeroShaderCanvasComponent = ComponentType;

export function DesktopHeroShader() {
  const [Canvas, setCanvas] = useState<HeroShaderCanvasComponent | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof globalThis.setTimeout> | undefined;

    const cancelScheduledLoad = () => {
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) globalThis.clearTimeout(timeoutId);
      idleId = undefined;
      timeoutId = undefined;
    };

    const loadShader = () => {
      void import("@/components/organisms/HeroShaderCanvas").then((module) => {
        if (disposed || !desktop.matches || reducedMotion.matches) return;
        setCanvas(() => module.HeroShaderCanvas);
      });
    };

    const update = () => {
      cancelScheduledLoad();

      if (!desktop.matches || reducedMotion.matches) {
        setCanvas(null);
        return;
      }

      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(loadShader, { timeout: 1200 });
      } else {
        timeoutId = globalThis.setTimeout(loadShader, 120);
      }
    };

    update();
    desktop.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      disposed = true;
      cancelScheduledLoad();
      desktop.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  return Canvas ? (
    <div className="absolute inset-0 hidden md:block">
      <Canvas />
    </div>
  ) : null;
}
