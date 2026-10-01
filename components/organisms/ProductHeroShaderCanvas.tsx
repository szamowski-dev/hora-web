"use client";

import { FlowingGradient, Shader } from "shaders/react";

export function ProductHeroShaderCanvas() {
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
        colorA="oklch(0.86 0.08 350)"
        colorB="oklch(0.78 0.12 300)"
        colorC="oklch(0.8 0.1 245)"
        colorD="oklch(0.9 0.05 230)"
        colorSpace="oklab"
        distortion={0.16}
        opacity={0.5}
        seed={31}
        speed={0.12}
      />
    </Shader>
  );
}
