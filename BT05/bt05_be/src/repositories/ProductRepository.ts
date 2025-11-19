import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Op } from "sequelize";

export interface ProductFilters {
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export class ProductRepository {
  async findAllPaginated(
    filters: ProductFilters,
    pagination: PaginationParams
  ): Promise<{ products: Product[]; total: number }> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.search) {
      where.name = {
        [Op.like]: `%${filters.search}%`,
      };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price[Op.gte] = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price[Op.lte] = filters.maxPrice;
      }
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      products: rows,
      total: count,
    };
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
