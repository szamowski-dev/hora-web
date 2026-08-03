"use client";

import {
  Circle,
  FilmGrain,
  FlowingGradient,
  Shader,
} from "shaders/react";

export function ProductHeroShaderCanvas() {
  return (
    <Shader
      className="h-full w-full"
      colorSpace="srgb"
      toneMapping="neutral"
      disableTelemetry
    >
      <Circle
        id="product-hero-mask"
        center={{ x: 0.5, y: 0.42 }}
        color="oklch(1 0 0)"
        radius={1.35}
        softness={1}
        visible={false}
      />
      <FlowingGradient
        colorA="oklch(0.144273 0.014268 262.103)"
        colorB="oklch(0.443226 0.153078 259.855)"
        colorC="oklch(0.794642 0.116521 239.522)"
        colorD="oklch(0.621492 0.104494 298.662)"
        colorSpace="oklab"
        distortion={0.28}
        maskSource="product-hero-mask"
        maskType="alpha"
        opacity={0.74}
        seed={31}
        speed={0.32}
      />
      <FilmGrain animated={false} strength={0.025} />
    </Shader>
  );
}
