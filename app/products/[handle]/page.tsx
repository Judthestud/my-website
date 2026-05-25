import BuyButton from "./BuyButton";

type ShopifyProduct = {
  title: string;
  description: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
  } | null;

  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };

  variants: {
    edges: {
      node: {
        id: string;
      };
    }[];
  };
};

async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const res = await fetch(`https://${domain}/api/2025-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token || "",
    },
    body: JSON.stringify({
      query: `
        query ProductByHandle($handle: String!) {
          productByHandle(handle: $handle) {
            title
            description
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      `,
      variables: { handle },
    }),
    cache: "no-store",
  });

  const json = await res.json();
  return json.data?.productByHandle || null;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-purple-300">Product not found.</p>
          <a href="/?step=gallery" className="mt-6 inline-block underline">
            Back to Gallery
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
          <img
            src={product.featuredImage?.url || "/images/cosmic-ocean-bg.png"}
            alt={product.featuredImage?.altText || product.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.35em] text-purple-300">
            Alignment Field Art
          </p>

          <h1 className="mt-5 text-5xl font-light tracking-wide">
            {product.title}
          </h1>

          <p className="mt-6 text-purple-100">
            ${Number(product.priceRange.minVariantPrice.amount).toFixed(2)}
          </p>

          <p className="mt-8 max-w-xl text-sm leading-7 text-white/60">
            {product.description}
          </p>

          <BuyButton variantId={product.variants.edges[0]?.node.id} />

          <a
            href="/?step=gallery"
            className="mt-10 inline-block w-fit rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.25em] text-white/70 hover:text-white"
          >
            Back to Gallery
          </a>
        </div>
      </div>
    </main>
  );
} 