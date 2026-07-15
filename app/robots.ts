import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/_next/",
          "/studio/",
          "/*?dpl=*",
        ],
      },
      { userAgent: "GPTBot", allow: "/", disallow: "" },
      { userAgent: "ClaudeBot", allow: "/", disallow: "" },
      { userAgent: "PerplexityBot", allow: "/", disallow: "" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
