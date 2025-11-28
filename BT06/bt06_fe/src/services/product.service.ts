import api from "./api";
import { Product, ProductListResponse, Category } from "../types";

export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const productService = {
  // Get all products with filters and pagination
  getProducts: async (
    filters: ProductFilters = {}
  ): Promise<ProductListResponse> => {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.categoryId)
      params.append("categoryId", filters.categoryId.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.minPrice !== undefined)
      params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== undefined)
      params.append("maxPrice", filters.maxPrice.toString());

    const response = await api.axiosInstance.get(
      `/products?${params.toString()}`
    );
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await api.axiosInstance.get(`/products/${id}`);
    return response.data.data;
  },

  // Create product (Admin only)
  createProduct: async (data: Partial<Product>): Promise<Product> => {
    const response = await api.axiosInstance.post("/products", data);
    return response.data.data;
  },

  // Update product (Admin only)
  updateProduct: async (
    id: number,
    data: Partial<Product>
  ): Promise<Product> => {
    const response = await api.axiosInstance.put(`/products/${id}`, data);
    return response.data.data;
  },

  // Delete product (Admin only)
  deleteProduct: async (id: number): Promise<void> => {
    await api.axiosInstance.delete(`/products/${id}`);
  },
};

export const categoryService = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.axiosInstance.get("/categories");
    return response.data.data;
  },

  // Get category by ID
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await api.axiosInstance.get(`/categories/${id}`);
    return response.data.data;
  },

  // Create category (Admin only)
  createCategory: async (data: Partial<Category>): Promise<Category> => {
    const response = await api.axiosInstance.post("/categories", data);
    return response.data.data;
  },

  // Update category (Admin only)
  updateCategory: async (
    id: number,
    data: Partial<Category>
  ): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
  },

  // Delete category (Admin only)
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
