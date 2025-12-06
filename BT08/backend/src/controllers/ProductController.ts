import { Request, Response } from "express";
import { ProductService } from "../services";

export class ProductController {
  // GET /api/products
  static async getProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getProducts(req.query);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/products/:id
  static async getProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      const product = await ProductService.getProductById(
        parseInt(id),
        userId ? parseInt(userId as string) : undefined
      );

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/products/:id/similar
  static async getSimilarProducts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { limit = 6 } = req.query;

      const similarProducts = await ProductService.getSimilarProducts(
        parseInt(id),
        parseInt(limit as string)
      );

      if (similarProducts === null) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(similarProducts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
