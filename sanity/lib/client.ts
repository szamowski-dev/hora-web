import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: "published",
  // Publish webhooks revalidate immediately; the API CDN can still serve the
  // pre-publish document then, which Next would cache again for 10 minutes.
  useCdn: false,
});
