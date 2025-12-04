import { gql } from "@apollo/client";

export const GET_CART = gql`
  query GetCart($userId: String!) {
    cart(userId: $userId) {
      items {
        id
        productId
        quantity
        selected
        product {
          id
          name
          price
          image
          description
        }
      }
      totalItems
      selectedCount
      totalPrice
      selectedTotalPrice
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductFilter) {
    products(filter: $filter) {
      id
      name
      price
      image
      description
    }
  }
`;
