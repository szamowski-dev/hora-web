import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    qualities: [60, 75, 90],
  },
  pageExtensions: ["ts", "tsx", "mdx"],
  async redirects() {
    return [
      {
        source: "/blog/2026-04-13-v0.6-qa-grind/",
        destination: "/blog/2026-04-13-v0-6-qa-grind/",
        permanent: true,
      },
      {
        source: "/blog/2026-04-13-v0.6-qa-grind",
        destination: "/blog/2026-04-13-v0-6-qa-grind/",
        permanent: true,
      },
      {
        source: "/blog/fantastical-alternative-google-calendar/",
        destination: "/blog/2026-05-06-fantastical-alternative-google-calendar/",
        permanent: true,
      },
      {
        source: "/blog/fantastical-alternative-google-calendar",
        destination: "/blog/2026-05-06-fantastical-alternative-google-calendar/",
        permanent: true,
      },
      {
        source: "/blog/from-polling-to-push/",
        destination: "/blog/2026-04-16-from-polling-to-push/",
        permanent: true,
      },
      {
        source: "/blog/from-polling-to-push",
        destination: "/blog/2026-04-16-from-polling-to-push/",
        permanent: true,
      },
      {
        source: "/blog/native-app-vs-electron-pwa/",
        destination: "/blog/2026-04-14-native-app-vs-electron-pwa/",
        permanent: true,
      },
      {
        source: "/blog/native-app-vs-electron-pwa",
        destination: "/blog/2026-04-14-native-app-vs-electron-pwa/",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
