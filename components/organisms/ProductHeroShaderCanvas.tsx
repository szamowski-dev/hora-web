"use client";

import { FlowingGradient, Shader } from "shaders/react";
import type { HeroGlow } from "@/lib/hero-glow";

export function ProductHeroShaderCanvas({ glow }: { glow: HeroGlow }) {
  const peak = Math.max(glow.purple, glow.pink, glow.blue);
  if (peak === 0) return null;

  return (
    <Shader
      className="h-full w-full"
      colorSpace="srgb"
      toneMapping="neutral"
      disableTelemetry
      style={{
        maskImage:
          "radial-gradient(ellipse 30% 65% at 8% 76%, black, transparent 85%), radial-gradient(ellipse 30% 65% at 94% 80%, black, transparent 85%)",
      }}
    >
      <FlowingGradient
        id="product-hero-flow"
        colorA={`oklch(0.86 0.08 350 / ${glow.pink / peak})`}
        colorB={`oklch(0.78 0.12 300 / ${glow.purple / peak})`}
        colorC={`oklch(0.8 0.1 245 / ${glow.blue / peak})`}
        colorD={`oklch(0.9 0.05 230 / ${glow.blue / peak})`}
        colorSpace="oklab"
        distortion={0.16}
        opacity={Math.min(1, 0.6 * peak / 50)}
        seed={31}
        speed={0.12}
      />
    </Shader>
  );
}
