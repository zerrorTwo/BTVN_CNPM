import { CategoryRepository } from "../repositories/CategoryRepository";
import { Category } from "../models/Category";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return await this.categoryRepository.findById(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return await this.categoryRepository.findBySlug(slug);
  }

  async createCategory(data: {
    name: string;
    description?: string;
    slug: string;
  }): Promise<Category> {
    // Check if slug already exists
    const existingCategory = await this.categoryRepository.findBySlug(
      data.slug
    );
    if (existingCategory) {
      throw new Error("Slug đã tồn tại");
    }

    return await this.categoryRepository.create(data);
  }

  async updateCategory(
    id: number,
    data: { name?: string; description?: string; slug?: string }
  ): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error("Không tìm thấy danh mục");
    }

    // Check if new slug already exists
    if (data.slug && data.slug !== category.slug) {
      const existingCategory = await this.categoryRepository.findBySlug(
        data.slug
      );
      if (existingCategory) {
        throw new Error("Slug đã tồn tại");
      }
    }

    const [, updatedCategories] = await this.categoryRepository.update(
      id,
      data
    );
    return updatedCategories[0];
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error("Không tìm thấy danh mục");
    }

    await this.categoryRepository.delete(id);
  }
}

export default CategoryService;
