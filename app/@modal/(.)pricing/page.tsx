import { PricingRouteDialog } from "@/components/molecules/PricingRouteDialog";
import { getHomePage } from "@/lib/home-repository";

export const revalidate = 600;

export default async function PricingModalPage() {
  const { pricing } = await getHomePage();
  return <PricingRouteDialog content={pricing} />;
}
