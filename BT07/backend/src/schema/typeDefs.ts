import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
    image: String!
    description: String
  }

  type CartItem {
    id: ID!
    userId: String!
    productId: Int!
    quantity: Int!
    selected: Boolean!
    product: Product!
  }

  type Cart {
    items: [CartItem!]!
    totalItems: Int!
    selectedCount: Int!
    totalPrice: Float!
    selectedTotalPrice: Float!
  }

  enum SortOrder {
    PRICE_ASC
    PRICE_DESC
    NAME_ASC
    NAME_DESC
    NEWEST
  }

  input ProductFilter {
    categoryId: Int
    minPrice: Float
    maxPrice: Float
    search: String
    sortBy: SortOrder
  }

  type User {
    id: ID!
    email: String!
    username: String!
    firstName: String
    lastName: String
  }

  type AuthPayload {
    user: User!
    accessToken: String!
    refreshToken: String!
  }

  type TokenPayload {
    accessToken: String!
  }

  type Query {
    cart(userId: String!): Cart!
    products(filter: ProductFilter): [Product!]!
    me: User
  }

  type Mutation {
    register(
      email: String!
      username: String!
      password: String!
      firstName: String
      lastName: String
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    refreshToken(refreshToken: String!): TokenPayload!

    addToCart(userId: String!, productId: Int!, quantity: Int!): CartItem!
    updateCartItem(id: Int!, quantity: Int, selected: Boolean): CartItem!
    removeCartItem(id: Int!): Boolean!
    removeMultipleItems(ids: [Int!]!): Boolean!
    selectItemsForCheckout(userId: String!, itemIds: [Int!]!): Cart!
    clearCart(userId: String!): Boolean!
  }
`;

export default typeDefs;
