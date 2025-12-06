import { Router } from "express";
import { FavoriteController } from "../controllers/FavoriteController";

const router = Router();

// GET /api/favorites?userId=:userId
router.get("/", FavoriteController.getFavorites);

// POST /api/favorites
router.post("/", FavoriteController.addFavorite);

// DELETE /api/favorites/:userId/:productId
router.delete("/:userId/:productId", FavoriteController.removeFavorite);

export default router;
