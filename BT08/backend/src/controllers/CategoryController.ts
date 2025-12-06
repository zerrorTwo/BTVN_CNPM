import { Request, Response } from "express";
import { CategoryService } from "../services";

export class CategoryController {
  // GET /api/categories
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/categories/:id
  static async getCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await CategoryService.getCategoryById(parseInt(id));
      res.json(category);
    } catch (error: any) {
      if (error.message === "Category not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/categories/:id/products
  static async getCategoryProducts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const products = await CategoryService.getCategoryProducts(parseInt(id));
      res.json(products);
    } catch (error: any) {
      if (error.message === "Category not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}
