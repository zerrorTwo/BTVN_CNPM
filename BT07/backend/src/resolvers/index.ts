import { cartQuery, cartMutations } from "./cartResolvers";
import { productQuery, productFieldResolvers } from "./productResolvers";
import { authMutations } from "./authResolvers";

const resolvers = {
  Query: {
    ...cartQuery,
    ...productQuery,
  },

  Mutation: {
    ...authMutations,
    ...cartMutations,
  },

  Product: {
    ...productFieldResolvers,
  },
};

export default resolvers;
