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
        color="#ffffff"
        radius={1.35}
        softness={1}
        visible={false}
      />
      <FlowingGradient
        colorA="#070a10"
        colorB="#174ea6"
        colorC="#70c6ff"
        colorD="#8f78bd"
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
