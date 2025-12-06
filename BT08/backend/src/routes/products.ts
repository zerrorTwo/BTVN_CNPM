import { Router } from "express";
import { ProductController } from "../controllers/ProductController";

const router = Router();

// GET /api/products - Get all products with filters
router.get("/", ProductController.getProducts);

// GET /api/products/:id - Get single product
router.get("/:id", ProductController.getProduct);

// GET /api/products/:id/similar - Get similar products
router.get("/:id/similar", ProductController.getSimilarProducts);

export default router;
