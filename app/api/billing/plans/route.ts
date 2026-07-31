import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const REVENUECAT_API_URL = "https://api.revenuecat.com";
const CATALOGUE_USER_ID = "pricing_catalogue";

type OfferingResponse = {
  current_offering_id?: string;
  offerings?: Array<{
    identifier: string;
    packages: Array<{ identifier: string; platform_product_identifier: string }>;
  }>;
};

type ProductResponse = {
  product_details?: Array<{
    identifier: string;
    current_price: { amount: number; currency: string } | null;
    purchase_options?: Record<string, { base_price?: { amount: number; currency: string } }>;
  }>;
};

function billingHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json",
    "X-Platform": "web",
    "X-Version": "1.51.0",
    "X-Is-Sandbox": "false",
  };
}

export async function GET() {
  const apiKey = process.env.WEB_BILLING_PUBLIC_API_KEY;
  if (
    !apiKey ||
    process.env.WEB_BILLING_ENVIRONMENT !== "sandbox" ||
    apiKey.startsWith("appl_")
  ) {
    return NextResponse.json({ error: "Sandbox web billing is not configured." }, { status: 503 });
  }

  try {
    const offeringsResponse = await fetch(
      `${REVENUECAT_API_URL}/v1/subscribers/${CATALOGUE_USER_ID}/offerings`,
      { headers: billingHeaders(apiKey), cache: "no-store" },
    );
    if (!offeringsResponse.ok) throw new Error("Offerings request failed");

    const offerings = (await offeringsResponse.json()) as OfferingResponse;
    const offering = offerings.offerings?.find((item) => item.identifier === "pro");
    if (offerings.current_offering_id !== "pro" || !offering) {
      throw new Error("Current offering is unavailable");
    }

    const packageIds = ["$rc_annual", "$rc_lifetime"] as const;
    const selectedPackages = packageIds.map((identifier) => offering.packages.find((item) => item.identifier === identifier));
    if (selectedPackages.some((item) => !item)) throw new Error("Required packages are unavailable");

    const productIds = selectedPackages.map((item) => item!.platform_product_identifier);
    const productParams = productIds.map((id) => `id=${encodeURIComponent(id)}`).join("&");
    const productsResponse = await fetch(
      `${REVENUECAT_API_URL}/rcbilling/v1/subscribers/${CATALOGUE_USER_ID}/products?${productParams}`,
      { headers: billingHeaders(apiKey), cache: "no-store" },
    );
    if (!productsResponse.ok) throw new Error("Products request failed");

    const products = (await productsResponse.json()) as ProductResponse;
    const productsById = new Map(products.product_details?.map((product) => [product.identifier, product]));
    const plans = selectedPackages.map((pkg) => {
      const product = productsById.get(pkg!.platform_product_identifier);
      const price = product?.current_price ?? product?.purchase_options?.base_option?.base_price;
      if (!product || !price) throw new Error("Product price is unavailable");
      return { identifier: pkg!.identifier, amount: price.amount, currency: price.currency };
    });

    return NextResponse.json({ plans });
  } catch {
    return NextResponse.json(
      { error: "The sandbox offering is unavailable. Check the RevenueCat web configuration." },
      { status: 503 },
    );
  }
}
