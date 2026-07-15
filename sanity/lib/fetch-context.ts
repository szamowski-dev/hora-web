import { cookies, draftMode } from "next/headers";
import { resolvePerspectiveFromCookies } from "next-sanity/live";
import { studioUrl } from "@/sanity/env";
import { client } from "@/sanity/lib/client";

export type SanityRepositoryOptions = {
  perspective?: "auto" | "published";
  stega?: boolean;
};

export async function getSanityFetchContext({
  perspective = "auto",
  stega = true,
}: SanityRepositoryOptions = {}) {
  if (perspective === "published") {
    return { client, draft: false } as const;
  }

  const { isEnabled } = await draftMode();
  if (!isEnabled) return { client, draft: false } as const;

  const token = process.env.SANITY_API_READ_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "Sanity Draft Mode is active, but SANITY_API_READ_TOKEN is missing. Add a read token to preview draft content.",
    );
  }

  const previewPerspective = await resolvePerspectiveFromCookies({
    cookies: await cookies(),
  });

  return {
    client: client.withConfig({
      perspective: previewPerspective,
      useCdn: false,
      token,
      stega: { enabled: stega, studioUrl },
    }),
    draft: true,
  } as const;
}
