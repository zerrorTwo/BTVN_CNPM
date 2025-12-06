import { Request, Response } from "express";
import { CartService } from "../services";
import { CartItem, Product, ProductImage } from "../models";

export class CartController {
  // GET /api/cart?userId=:userId
  static async getCart(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const cartData = await CartService.getCartWithItems(
        parseInt(userId as string)
      );

      res.json({
        items: cartData.items,
        ...cartData.stats,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/cart/items
  static async addToCart(req: Request, res: Response) {
    try {
      const { userId, productId, quantity } = req.body;

      if (!userId || !productId || !quantity) {
        return res
          .status(400)
          .json({ error: "userId, productId, and quantity are required" });
      }

      const cartItem = await CartService.addItemToCart(
        parseInt(userId),
        productId,
        quantity
      );

      const itemWithProduct = await CartItem.findByPk(cartItem.id, {
        include: [
          {
            model: Product,
            as: "product",
            include: [{ model: ProductImage, as: "images" }],
          },
        ],
      });

      res.status(201).json(itemWithProduct);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/cart/items/:id
  static async updateCartItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantity, selected } = req.body;

      const cartItem = await CartItem.findByPk(id);
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      if (quantity !== undefined) {
        cartItem.quantity = quantity;
      }
      if (selected !== undefined) {
        cartItem.selected = selected;
      }

      await cartItem.save();

      const updatedItem = await CartItem.findByPk(id, {
        include: [
          {
            model: Product,
            as: "product",
            include: [{ model: ProductImage, as: "images" }],
          },
        ],
      });

      res.json(updatedItem);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/cart/items/:id
  static async removeCartItem(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await CartItem.destroy({
        where: { id },
      });

      if (deleted) {
        res.json({ success: true, message: "Item removed from cart" });
      } else {
        res.status(404).json({ error: "Cart item not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/cart/items/multiple
  static async removeMultipleItems(req: Request, res: Response) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ error: "ids array is required" });
      }

      const deleted = await CartItem.destroy({
        where: { id: ids },
      });

      res.json({
        success: true,
        message: `${deleted} items removed`,
        count: deleted,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/cart?userId=:userId
  static async clearCart(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      await CartService.clearCart(parseInt(userId as string));

      res.json({ success: true, message: "Cart cleared" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/cart/select-items
  static async selectItemsForCheckout(req: Request, res: Response) {
    try {
      const { userId, itemIds } = req.body;

      if (!userId || !itemIds || !Array.isArray(itemIds)) {
        return res
          .status(400)
          .json({ error: "userId and itemIds array are required" });
      }

      const cart = await CartService.getOrCreateCart(parseInt(userId));

      // Unselect all items first
      await CartItem.update(
        { selected: false },
        { where: { cartId: cart.id } }
      );

      // Select specified items
      await CartItem.update(
        { selected: true },
        { where: { id: itemIds, cartId: cart.id } }
      );

      const items = await CartItem.findAll({
        where: { cartId: cart.id },
        include: [{ model: Product, as: "product" }],
      });

      const selectedCount = items.filter((item: any) => item.selected).length;
      const selectedTotalPrice = items
        .filter((item: any) => item.selected)
        .reduce(
          (sum, item: any) => sum + item.product.price * item.quantity,
          0
        );

      res.json({
        items: items.map((item: any) => ({
          id: item.id,
          selected: item.selected,
        })),
        selectedCount,
        selectedTotalPrice,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
