const noiseUrl =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[radial-gradient(ellipse_85%_58%_at_8%_8%,oklch(0.4269_0.1069_255.7/0.045),transparent_70%),radial-gradient(ellipse_90%_62%_at_88%_100%,oklch(0.6532_0.2328_25.7/0.025),transparent_72%)] md:bg-none"
    >
      {/* Bottom-center ember */}
      <div
        className="absolute bottom-[-15%] left-1/2 hidden h-[75%] w-[90%] rounded-full blur-[80px] md:block"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.6532 0.2328 25.7 / 0.035) 0%, oklch(0.725 0.18 27 / 0.015) 30%, oklch(0.6532 0.2328 25.7 / 0.005) 55%, transparent 75%)",
          animation: "glow-float-a 80s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* Top-left soft glow */}
      <div
        className="absolute top-[-10%] left-[-10%] hidden h-[55%] w-[55%] rounded-full blur-[70px] md:block"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.4269 0.1069 255.7 / 0.055) 0%, oklch(0.4269 0.1069 255.7 / 0.018) 40%, transparent 70%)",
          animation: "glow-float-b 90s ease-in-out infinite",
          animationDelay: "-8s",
          willChange: "transform, opacity",
        }}
      />

      {/* Top-right accent */}
      <div
        className="absolute top-0 right-[-5%] hidden h-[55%] w-[50%] rounded-full blur-[60px] md:block"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.8056 0.1054 244.5 / 0.025) 0%, oklch(0.4269 0.1069 255.7 / 0.012) 40%, transparent 65%)",
          animation: "glow-float-c 70s ease-in-out infinite",
          animationDelay: "-14s",
          willChange: "transform, opacity",
        }}
      />

      {/* Fine grain noise */}
      <div
        className="absolute inset-0 hidden opacity-[0.035] mix-blend-overlay md:block"
        style={{ backgroundImage: noiseUrl, backgroundSize: "200px 200px" }}
      />
    </div>
  );
}
