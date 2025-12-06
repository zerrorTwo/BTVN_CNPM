import { Category, Product } from "../models";

export class CategoryService {
  static async getAllCategories() {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });

    return categories;
  }

  static async getCategoryById(id: number) {
    const category = await Category.findByPk(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  static async getCategoryProducts(id: number) {
    const category = await Category.findByPk(id);

    if (!category) {
      throw new Error("Category not found");
    }

    const products = await Product.findAll({
      where: { categoryId: id },
    });

    return products;
  }
}
