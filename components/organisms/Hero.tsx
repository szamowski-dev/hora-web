import { home } from "@/content/home";
import { getTestFlightTesterCount } from "@/lib/testflight";
import { HeroScene } from "./HeroScene";

export async function Hero() {
  const socialProof = home.hero.newsletter.socialProof;
  const liveCount = await getTestFlightTesterCount(socialProof.count);

  return <HeroScene liveCount={liveCount} />;
}
