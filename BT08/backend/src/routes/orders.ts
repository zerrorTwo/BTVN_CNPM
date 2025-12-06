import { Router } from "express";
import { OrderController } from "../controllers/OrderController";

const router = Router();

// GET /api/orders?userId=:userId
router.get("/", OrderController.getOrders);

// GET /api/orders/:id
router.get("/:id", OrderController.getOrder);

// POST /api/orders
router.post("/", OrderController.createOrder);

export default router;
