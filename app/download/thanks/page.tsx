import type { Metadata } from "next";
import { DownloadThanks } from "@/components/organisms/DownloadThanks";
import {
  DIRECT_DOWNLOAD_ORIGIN,
  DIRECT_LATEST_MANIFEST_PATH,
  validateDirectReleaseManifest,
} from "@/lib/direct/download";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Thanks for downloading hora Calendar",
  description:
    "Your hora Calendar download has started. Open the disk image, drag hora Calendar into Applications and sign in with Google.",
  alternates: { canonical: "/download/thanks/" },
  robots: { index: false, follow: true },
};

/** Name of the file the browser is saving, e.g. hora-calendar-1.1.8-511.dmg. */
async function latestFileName(): Promise<string> {
  try {
    const response = await fetch(
      new URL(DIRECT_LATEST_MANIFEST_PATH, DIRECT_DOWNLOAD_ORIGIN),
      { next: { revalidate }, signal: AbortSignal.timeout(5_000) },
    );
    return validateDirectReleaseManifest(await response.json()).archiveFileName;
  } catch {
    return "hora-calendar.dmg";
  }
}

export default async function DownloadThanksPage() {
  return <DownloadThanks fileName={await latestFileName()} />;
}
