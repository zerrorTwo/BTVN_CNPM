import { Router } from "express";
import { CartController } from "../controllers/CartController";

const router = Router();

// GET /api/cart?userId=:userId
router.get("/", CartController.getCart);

// POST /api/cart/items
router.post("/items", CartController.addToCart);

// PUT /api/cart/items/:id
router.put("/items/:id", CartController.updateCartItem);

// DELETE /api/cart/items/:id
router.delete("/items/:id", CartController.removeCartItem);

// DELETE /api/cart/items/multiple
router.delete("/items/multiple", CartController.removeMultipleItems);

// DELETE /api/cart?userId=:userId
router.delete("/", CartController.clearCart);

// PUT /api/cart/select-items
router.put("/select-items", CartController.selectItemsForCheckout);

export default router;
