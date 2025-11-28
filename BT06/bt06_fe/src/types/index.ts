export interface User {
  id?: number;
  email: string;
  fullName: string;
  role?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user?: User;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: number;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination: PaginationInfo;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}
