import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:4000/api";

// Types
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  isFavorite: boolean;
  purchaseCount: number;
  commentCount: number;
  averageRating?: number | null;
  categoryId?: number;
}

export interface Comment {
  id: number;
  userId: number;
  productId: number;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

// Create API
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: [
    "Products",
    "Favorites",
    "Comments",
    "Cart",
    "ProductViews",
    "Categories",
  ],
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query<
      Product[],
      { userId?: number; categoryId?: number; search?: string; sortBy?: string }
    >({
      query: (params) => ({ url: "/products", params }),
      providesTags: ["Products"],
    }),
    getProduct: builder.query<Product, { id: number; userId?: number }>({
      query: ({ id, userId }) => ({
        url: `/products/${id}`,
        params: { userId },
      }),
      providesTags: (result, error, { id }) => [{ type: "Products", id }],
    }),
    getSimilarProducts: builder.query<
      Product[],
      { productId: number; limit?: number }
    >({
      query: ({ productId, limit = 6 }) => ({
        url: `/products/${productId}/similar`,
        params: { limit },
      }),
    }),

    // Favorites
    getFavorites: builder.query<Product[], number>({
      query: (userId) => ({ url: "/favorites", params: { userId } }),
      providesTags: ["Favorites"],
    }),
    addFavorite: builder.mutation<any, { userId: number; productId: number }>({
      query: (body) => ({ url: "/favorites", method: "POST", body }),
      invalidatesTags: ["Favorites", "Products"],
    }),
    removeFavorite: builder.mutation<
      any,
      { userId: number; productId: number }
    >({
      query: ({ userId, productId }) => ({
        url: `/favorites/${userId}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorites", "Products"],
    }),

    // Comments
    getComments: builder.query<Comment[], number>({
      query: (productId) => ({ url: "/comments", params: { productId } }),
      providesTags: ["Comments"],
    }),
    addComment: builder.mutation<
      Comment,
      { userId: number; productId: number; content: string; rating: number }
    >({
      query: (body) => ({ url: "/comments", method: "POST", body }),
      invalidatesTags: ["Comments", "Products"],
    }),
    updateComment: builder.mutation<
      Comment,
      { id: number; content?: string; rating?: number }
    >({
      query: ({ id, ...body }) => ({
        url: `/comments/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Comments"],
    }),
    deleteComment: builder.mutation<any, number>({
      query: (id) => ({ url: `/comments/${id}`, method: "DELETE" }),
      invalidatesTags: ["Comments", "Products"],
    }),

    // Product Views
    getViewedProducts: builder.query<
      Product[],
      { userId: number; limit?: number }
    >({
      query: ({ userId, limit = 10 }) => ({
        url: "/product-views",
        params: { userId, limit },
      }),
      providesTags: ["ProductViews"],
    }),
    trackProductView: builder.mutation<
      void,
      { userId: number; productId: number }
    >({
      query: (body) => ({ url: "/product-views", method: "POST", body }),
      invalidatesTags: ["ProductViews"],
    }),

    // Categories
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),

    // Cart
    getCart: builder.query<
      {
        items: any[];
        totalItems: number;
        selectedCount: number;
        totalPrice: number;
        selectedTotalPrice: number;
      },
      number
    >({
      query: (userId) => ({ url: "/cart", params: { userId } }),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<
      any,
      { userId: number; productId: number; quantity: number }
    >({
      query: (body) => ({ url: "/cart/items", method: "POST", body }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<
      any,
      { id: number; quantity?: number; selected?: boolean }
    >({
      query: ({ id, ...body }) => ({
        url: `/cart/items/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation<void, number>({
      query: (id) => ({ url: `/cart/items/${id}`, method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation<void, number>({
      query: (userId) => ({
        url: "/cart",
        method: "DELETE",
        params: { userId },
      }),
      invalidatesTags: ["Cart"],
    }),

    // Auth
    login: builder.mutation<
      {
        user: {
          id: number;
          email: string;
          username: string;
          firstName?: string;
          lastName?: string;
        };
        accessToken: string;
        refreshToken: string;
      },
      { email: string; password: string }
    >({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<
      {
        user: { id: number; email: string; username: string };
        accessToken: string;
        refreshToken: string;
      },
      {
        email: string;
        username: string;
        password: string;
        firstName?: string;
        lastName?: string;
      }
    >({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetSimilarProductsQuery,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetViewedProductsQuery,
  useTrackProductViewMutation,
  useGetCategoriesQuery,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useLoginMutation,
  useRegisterMutation,
} = api;
