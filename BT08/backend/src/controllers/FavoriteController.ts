import { Request, Response } from "express";
import { FavoriteService } from "../services";

export class FavoriteController {
  // GET /api/favorites?userId=:userId
  static async getFavorites(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const products = await FavoriteService.getUserFavorites(
        parseInt(userId as string)
      );
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/favorites
  static async addFavorite(req: Request, res: Response) {
    try {
      const { userId, productId } = req.body;

      if (!userId || !productId) {
        return res
          .status(400)
          .json({ error: "userId and productId are required" });
      }

      const { favorite, created } = await FavoriteService.addFavorite(
        userId,
        productId
      );
      res.status(created ? 201 : 200).json(favorite);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/favorites/:userId/:productId
  static async removeFavorite(req: Request, res: Response) {
    try {
      const { userId, productId } = req.params;

      const deleted = await FavoriteService.removeFavorite(
        parseInt(userId),
        parseInt(productId)
      );

      if (deleted) {
        res.json({ success: true, message: "Favorite removed" });
      } else {
        res.status(404).json({ error: "Favorite not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
