import { shopifyFetch } from "./shopify";

const TEST_QUERY = `
  query {
    products(first: 3) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

export async function getTestProducts() {
  return shopifyFetch(TEST_QUERY);
} 