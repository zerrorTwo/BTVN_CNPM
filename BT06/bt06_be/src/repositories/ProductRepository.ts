import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Op, literal } from "sequelize";
import { SearchService } from "../services/search.service";

export interface ProductFilters {
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  hasDiscount?: boolean;
  minViews?: number;
  sort?: string; // price_asc, price_desc, views_desc, newest
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export class ProductRepository {
  private searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }

  async findAllPaginated(
    filters: ProductFilters,
    pagination: PaginationParams
  ): Promise<{ products: Product[]; total: number }> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    // ALWAYS use Elasticsearch for all queries
    try {
      const elasticResults = await this.searchService.search({
        keyword: filters.search,
        categoryId: filters.categoryId,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        hasDiscount: filters.hasDiscount,
        minViews: filters.minViews,
        sort: filters.sort,
        limit,
        offset,
      });

      // Get product IDs from Elasticsearch results (already an array of IDs)
      const productIds = elasticResults;

      if (productIds.length === 0) {
        return { products: [], total: 0 };
      }

      // Fetch full product details from database maintaining ES order using SQL ORDER BY FIELD
      const products = await Product.findAll({
        where: {
          id: {
            [Op.in]: productIds,
          },
        },
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name", "slug"],
          },
        ],
        order: literal(`FIELD(Product.id, ${productIds.join(",")})`),
      });

      // Get total count from Elasticsearch
      const totalResults = await this.searchService.count({
        keyword: filters.search,
        categoryId: filters.categoryId,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        hasDiscount: filters.hasDiscount,
        minViews: filters.minViews,
      });

      return {
        products,
        total: totalResults,
      };
    } catch (error) {
      console.error("Elasticsearch search failed:", error);
      // Return empty results if ES fails
      return { products: [], total: 0 };
    }
  }

  async findById(id: number): Promise<Product | null> {
    return await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
    });
  }

  async create(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    categoryId: number;
  }): Promise<Product> {
    const product = await Product.create(data);

    // Auto-sync to Elasticsearch
    try {
      await this.searchService.indexProduct(product);
    } catch (error) {
      console.error("Failed to index product in ES:", error);
    }

    return product;
  }

  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      imageUrl?: string;
      categoryId?: number;
    }
  ): Promise<[number, Product[]]> {
    const result = await Product.update(data, {
      where: { id },
      returning: true,
    });

    // Auto-sync to Elasticsearch
    try {
      const updatedProduct = await Product.findByPk(id);
      if (updatedProduct) {
        await this.searchService.indexProduct(updatedProduct);
      }
    } catch (error) {
      console.error("Failed to update product in ES:", error);
    }

    return result;
  }

  async delete(id: number): Promise<number> {
    const result = await Product.destroy({
      where: { id },
    });

    // Auto-sync to Elasticsearch - remove from index
    try {
      await this.searchService.deleteProduct(id);
    } catch (error) {
      console.error("Failed to delete product from ES:", error);
    }

    return result;
  }

  async updateStock(id: number, quantity: number): Promise<void> {
    const product = await Product.findByPk(id);
    if (product) {
      product.stock = quantity;
      await product.save();
    }
  }
}

export default ProductRepository;
