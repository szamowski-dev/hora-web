import type { Metadata } from "next";
import { DownloadThanks } from "@/components/organisms/DownloadThanks";

export const metadata: Metadata = {
  title: "Thanks for downloading hora",
  description:
    "Your hora download has started. Open the disk image, drag hora into Applications and sign in with Google.",
  alternates: { canonical: "/download/thanks/" },
  robots: { index: false, follow: true },
};

export default function DownloadThanksPage() {
  return <DownloadThanks />;
}
