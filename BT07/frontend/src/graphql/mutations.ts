import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation Register(
    $email: String!
    $username: String!
    $password: String!
    $firstName: String
    $lastName: String
  ) {
    register(
      email: $email
      username: $username
      password: $password
      firstName: $firstName
      lastName: $lastName
    ) {
      user {
        id
        email
        username
        firstName
        lastName
      }
      accessToken
      refreshToken
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        email
        username
        firstName
        lastName
      }
      accessToken
      refreshToken
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($userId: String!, $productId: Int!, $quantity: Int!) {
    addToCart(userId: $userId, productId: $productId, quantity: $quantity) {
      id
      productId
      quantity
      selected
      product {
        id
        name
        price
        image
      }
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($id: Int!, $quantity: Int, $selected: Boolean) {
    updateCartItem(id: $id, quantity: $quantity, selected: $selected) {
      id
      quantity
      selected
    }
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($id: Int!) {
    removeCartItem(id: $id)
  }
`;

export const REMOVE_MULTIPLE_ITEMS = gql`
  mutation RemoveMultipleItems($ids: [Int!]!) {
    removeMultipleItems(ids: $ids)
  }
`;

export const SELECT_ITEMS_FOR_CHECKOUT = gql`
  mutation SelectItemsForCheckout($userId: String!, $itemIds: [Int!]!) {
    selectItemsForCheckout(userId: $userId, itemIds: $itemIds) {
      items {
        id
        selected
      }
      selectedCount
      selectedTotalPrice
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart($userId: String!) {
    clearCart(userId: $userId)
  }
`;
