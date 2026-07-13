const noiseUrl =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Bottom-center ember */}
      <div
        className="absolute bottom-[-15%] left-1/2 h-[75%] w-[90%] rounded-full blur-[80px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,56,60,0.035) 0%, rgba(255,115,110,0.015) 30%, rgba(255,56,60,0.005) 55%, transparent 75%)",
          animation: "glow-float-a 80s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* Top-left soft glow */}
      <div
        className="absolute top-[-10%] left-[-10%] h-[55%] w-[55%] rounded-full blur-[70px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(34,79,136,0.055) 0%, rgba(34,79,136,0.018) 40%, transparent 70%)",
          animation: "glow-float-b 90s ease-in-out infinite",
          animationDelay: "-8s",
          willChange: "transform, opacity",
        }}
      />

      {/* Top-right accent */}
      <div
        className="absolute top-0 right-[-5%] h-[55%] w-[50%] rounded-full blur-[60px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(131,199,255,0.025) 0%, rgba(34,79,136,0.012) 40%, transparent 65%)",
          animation: "glow-float-c 70s ease-in-out infinite",
          animationDelay: "-14s",
          willChange: "transform, opacity",
        }}
      />

      {/* Fine grain noise */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: noiseUrl, backgroundSize: "200px 200px" }}
      />
    </div>
  );
}
