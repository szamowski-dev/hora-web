import type { HomePageContent } from "@/lib/home-model";
import { HeroScene } from "./HeroScene";

export function Hero({
  content,
  liveCount,
}: {
  content: HomePageContent["hero"];
  liveCount: number;
}) {
  return <HeroScene content={content} liveCount={liveCount} />;
}
