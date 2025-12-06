import { Router } from "express";
import { ProductViewController } from "../controllers/ProductViewController";

const router = Router();

// GET /api/product-views?userId=:userId&limit=:limit
router.get("/", ProductViewController.getViewedProducts);

// POST /api/product-views
router.post("/", ProductViewController.trackProductView);

export default router;
