import { Category } from "../models/Category";
import { Product } from "../models/Product";

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return await Category.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async findById(id: number): Promise<Category | null> {
    return await Category.findByPk(id);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return await Category.findOne({
      where: { slug },
    });
  }

  async create(data: {
    name: string;
    description?: string;
    slug: string;
  }): Promise<Category> {
    return await Category.create(data);
  }

  async update(
    id: number,
    data: { name?: string; description?: string; slug?: string }
  ): Promise<[number, Category[]]> {
    return await Category.update(data, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: number): Promise<number> {
    return await Category.destroy({
      where: { id },
    });
  }
}

export default CategoryRepository;
