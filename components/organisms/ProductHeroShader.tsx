import { ProductHeroShaderMotion } from "@/components/organisms/ProductHeroShaderMotion";

const fallbackBackground = [
  "radial-gradient(ellipse 62% 68% at 42% 30%, oklch(0.72 0.1 235 / 0.13), transparent 72%)",
  "radial-gradient(ellipse 58% 70% at 68% 42%, oklch(0.62 0.1 295 / 0.1), transparent 74%)",
  "radial-gradient(ellipse 82% 70% at 50% 18%, oklch(0.5 0.1 255 / 0.08), transparent 76%)",
].join(", ");

export function ProductHeroShader() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 -top-24 h-[42rem] w-screen min-w-[72rem] -translate-x-1/2 sm:-top-28 sm:h-[49rem]"
    >
      <div
        className="absolute inset-y-0 -inset-x-[20%]"
        style={{ backgroundImage: fallbackBackground }}
      />
      <ProductHeroShaderMotion />
    </div>
  );
}
