import { DesktopHeroShader } from "@/components/organisms/DesktopHeroShader";

const heroBackground = [
  "radial-gradient(ellipse 74% 78% at 6% 18%, oklch(0.6532 0.2328 25.7 / 0.34), transparent 66%)",
  "radial-gradient(ellipse 70% 82% at 88% 18%, oklch(0.4269 0.1069 255.7 / 0.38), transparent 68%)",
  "radial-gradient(ellipse 68% 70% at 76% 86%, oklch(0.42 0.1 160 / 0.18), transparent 70%)",
  "radial-gradient(ellipse 74% 76% at 40% 54%, oklch(0.407 0.128 306 / 0.14), transparent 72%)",
  "linear-gradient(135deg, oklch(0.1438 0.0075 256.9), oklch(0.105 0.008 261.8))",
].join(", ");

/**
 * Server-rendered fallback for every device. The real WebGL layer is restored
 * on desktop by DesktopHeroShader, but stays outside the mobile bundle.
 */
export function HeroShader() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-panel-deep">
      <div
        className="absolute inset-0"
        style={{ backgroundImage: heroBackground }}
      />
      <div className="home-grid absolute inset-0 opacity-45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_68%_at_58%_34%,transparent_0%,oklch(0.105_0.008_261.8/0.14)_68%,oklch(0.105_0.008_261.8/0.42)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.9851_0_0/0.025),transparent_28%,oklch(0_0_0/0.2))]" />
      <DesktopHeroShader />
    </div>
  );
}
