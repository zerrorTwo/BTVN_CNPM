import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";

const router = Router();

// GET /api/categories
router.get("/", CategoryController.getCategories);

// GET /api/categories/:id
router.get("/:id", CategoryController.getCategory);

// GET /api/categories/:id/products
router.get("/:id/products", CategoryController.getCategoryProducts);

export default router;
