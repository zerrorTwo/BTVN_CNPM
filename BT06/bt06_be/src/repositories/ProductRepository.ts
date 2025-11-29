import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Op } from "sequelize";
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

      // Get product IDs from Elasticsearch results
      const productIds = elasticResults.map((result: any) => result.id);
      
      if (productIds.length === 0) {
        return { products: [], total: 0 };
      }

      // Fetch full product details from database maintaining ES order
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
      });

      // Maintain Elasticsearch order
      const orderedProducts = productIds
        .map(id => products.find(p => p.id === id))
        .filter(p => p !== undefined) as Product[];

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
        products: orderedProducts,
        total: totalResults,
      };
    } catch (error) {
      console.error('Elasticsearch search failed:', error);
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
    return await Product.create(data);
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
    return await Product.update(data, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: number): Promise<number> {
    return await Product.destroy({
      where: { id },
    });
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
