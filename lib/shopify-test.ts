import { shopifyFetch } from "./shopify";

const TEST_QUERY = `
  query {
    products(first: 12) {
      edges {
        node {
          id
          title
          handle
          description
          onlineStoreUrl
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
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export async function getTestProducts() {
  return shopifyFetch(TEST_QUERY);
}
