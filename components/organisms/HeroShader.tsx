"use client";

import { useEffect, useState } from "react";
import {
  Blob,
  DotGrid,
  FilmGrain,
  LinearGradient,
  Shader,
} from "shaders/react";

export function HeroShader() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className="absolute inset-0 bg-[#090a0d]">
      <Shader
        className="h-full w-full"
        colorSpace="p3-linear"
        toneMapping="aces"
        disableTelemetry
      >
        <LinearGradient
          colorA="#07090d"
          colorB="#241014"
          colorSpace="oklch"
          edges="mirror"
          start={{ x: 0.12, y: 0.82 }}
          end={{ x: 0.88, y: 0.16 }}
        />
        <Blob
          blendMode="normal-oklch"
          center={{ x: 0.68, y: 0.34 }}
          colorA="#ff383c"
          colorB="#224f88"
          colorSpace="oklch"
          deformation={0.55}
          highlightColor="#83c7ff"
          highlightIntensity={0.35}
          opacity={0.72}
          size={0.82}
          softness={0.92}
          speed={reducedMotion ? 0 : 0.22}
        />
        <DotGrid
          blendMode="linearDodge"
          color="#d7e9ff"
          density={58}
          dotSize={0.055}
          opacity={0.12}
          twinkle={0}
        />
        <FilmGrain strength={0.035} animated={false} />
      </Shader>
    </div>
  );
}
