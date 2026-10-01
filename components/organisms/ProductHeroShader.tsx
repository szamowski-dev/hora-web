import { ProductHeroShaderMotion } from "@/components/organisms/ProductHeroShaderMotion";

const fallbackBackground = [
  "radial-gradient(ellipse 34% 70% at 8% 80%, oklch(0.72 0.12 300 / 0.18), transparent 76%)",
  "radial-gradient(ellipse 28% 52% at 12% 50%, oklch(0.82 0.1 350 / 0.12), transparent 78%)",
  "radial-gradient(ellipse 36% 72% at 94% 84%, oklch(0.8 0.1 245 / 0.19), transparent 78%)",
].join(", ");

export function ProductHeroShader() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 -top-24 h-[42rem] w-screen -translate-x-1/2 sm:-top-28 sm:h-[49rem]"
      style={{ maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" }}
    >
      <div
        className="absolute inset-y-0 -inset-x-[20%]"
        style={{ backgroundImage: fallbackBackground }}
      />
      <ProductHeroShaderMotion />
    </div>
  );
}
