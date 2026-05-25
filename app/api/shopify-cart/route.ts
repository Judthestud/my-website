import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { variantId } = await req.json();

  const res = await fetch(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
      },
      body: JSON.stringify({
        query: `
          mutation CartCreate($variantId: ID!) {
            cartCreate(
              input: {
                lines: [
                  {
                    merchandiseId: $variantId
                    quantity: 1
                  }
                ]
              }
            ) {
              cart {
                checkoutUrl
              }
              userErrors {
                message
              }
            }
          }
        `,
        variables: { variantId },
      }),
    }
  );

  const json = await res.json();

  const rawCheckoutUrl = json.data?.cartCreate?.cart?.checkoutUrl;

  if (!rawCheckoutUrl) {
    return NextResponse.json(
      { error: "No checkout URL" },
      { status: 500 }
    );
  }

  const checkout = new URL(rawCheckoutUrl);
  checkout.hostname = "shop.thealignmentfield.com";

  return NextResponse.json({
    checkoutUrl: checkout.toString(),
  });
} 