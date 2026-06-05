import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { withPostHogConfig } from "@posthog/nextjs-config";

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

const config = withMDX(nextConfig);

// Upload source maps to PostHog on production builds so error-tracking stack
// traces resolve to the original TypeScript instead of minified bundle frames.
// Requires two env vars in the Vercel project settings:
//   POSTHOG_API_KEY    — personal API key with "error tracking" write scope
//   POSTHOG_PROJECT_ID — project ID (Settings → Project), here 395439
// When the key is absent (local dev, or a preview without secrets) we skip the
// wrapper so builds never fail on a missing token.
export default process.env.POSTHOG_API_KEY
  ? withPostHogConfig(config, {
      personalApiKey: process.env.POSTHOG_API_KEY,
      projectId: process.env.POSTHOG_PROJECT_ID!,
      host: "https://us.posthog.com",
      sourcemaps: {
        // enabled is left unset → defaults to on for `next build`, off for dev
        deleteAfterUpload: true,
      },
    })
  : config;
