import {
  ProductRepository,
  ProductFilters,
  PaginationParams,
} from "../repositories/ProductRepository";
import { Product } from "../models/Product";
import { CategoryRepository } from "../repositories/CategoryRepository";

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export class ProductService {
  private productRepository: ProductRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async getProducts(
    filters: ProductFilters,
    pagination: PaginationParams
  ): Promise<ProductListResponse> {
    const { products, total } = await this.productRepository.findAllPaginated(
      filters,
      pagination
    );

    const totalPages = Math.ceil(total / pagination.limit);
    const hasMore = pagination.page < totalPages;

    return {
      products,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
        hasMore,
      },
    };
  }

  async getProductById(id: number): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }

  async createProduct(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    categoryId: number;
  }): Promise<Product> {
    // Validate category exists
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new Error("Không tìm thấy danh mục");
    }

    return await this.productRepository.create(data);
  }

  async updateProduct(
    id: number,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      imageUrl?: string;
      categoryId?: number;
    }
  ): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    // Validate category if provided
    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new Error("Không tìm thấy danh mục");
      }
    }

    const [, updatedProducts] = await this.productRepository.update(id, data);
    return updatedProducts[0];
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    await this.productRepository.delete(id);
  }

  async updateStock(id: number, quantity: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    await this.productRepository.updateStock(id, quantity);
  }
}

export default ProductService;
