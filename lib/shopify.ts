export async function shopifyFetch(query: string, variables = {}) {
  const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": process.env.STOREFRONT_TOKEN || "",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${JSON.stringify(json)}`);
  }

  if (json.errors) {
    throw new Error(JSON.stringify(json.errors, null, 2));
  }

  return json.data;
} 