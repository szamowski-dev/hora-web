import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return (
    <div className="fixed inset-0 z-[200] bg-black">
      <NextStudio config={config} />
    </div>
  );
}
