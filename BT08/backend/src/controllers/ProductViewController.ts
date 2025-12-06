import { Request, Response } from "express";
import { ProductViewService } from "../services";

export class ProductViewController {
  // GET /api/product-views?userId=:userId&limit=:limit
  static async getViewedProducts(req: Request, res: Response) {
    try {
      const { userId, limit = 10 } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const products = await ProductViewService.getViewedProducts(
        parseInt(userId as string),
        parseInt(limit as string)
      );

      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/product-views
  static async trackProductView(req: Request, res: Response) {
    try {
      const { userId, productId } = req.body;

      if (!userId || !productId) {
        return res
          .status(400)
          .json({ error: "userId and productId are required" });
      }

      const view = await ProductViewService.trackView(userId, productId);
      res.status(201).json(view);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
