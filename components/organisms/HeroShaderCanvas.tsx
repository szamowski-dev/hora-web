"use client";

import {
  Ascii,
  Blob,
  ChromaFlow,
  FilmGrain,
  LinearGradient,
  Shader,
} from "shaders/react";

export function HeroShaderCanvas() {
  return (
    <Shader
      className="h-full w-full"
      colorSpace="p3-linear"
      toneMapping="aces"
      disableTelemetry
    >
      <LinearGradient
        id="hero-gradient-mask"
        angle={62}
        colorA="oklch(0.6532 0.2328 25.7)"
        colorB="oklch(0.1438 0.0075 256.9)"
        colorSpace="oklch"
        edges="mirror"
        end={{ x: 1, y: 0 }}
      />
      <Blob
        id="hero-flow-mask"
        blendMode="normal-oklch"
        center={{ x: 1, y: 0.5 }}
        colorA="oklch(0.4269 0.1069 255.7)"
        colorB="oklch(0.3345 0.121 25.7)"
        colorSpace="oklch"
        highlightColor="oklch(0.6532 0.2328 25.7)"
        highlightIntensity={0.3}
        maskSource="hero-gradient-mask"
        opacity={0.52}
        size={0.85}
        speed={0.18}
      />
      <Ascii
        alphaThreshold={0.06}
        blendMode="screen"
        cellSize={18}
        characters="01&lt;&gt;/{}=+-. "
        fontFamily="Geist Mono"
        gamma={1.45}
        opacity={0.28}
        preserveAlpha
        spacing={0.82}
      />
      <FilmGrain strength={0.1} animated={false} />
      <ChromaFlow
        blendMode="normal"
        intensity={0.7}
        maskSource="hero-flow-mask"
        momentum={36}
        opacity={0.7}
        radius={1.6}
      />
    </Shader>
  );
}
