import { Request, Response } from "express";
import { OrderService } from "../services";

export class OrderController {
  // GET /api/orders?userId=:userId
  static async getOrders(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const orders = await OrderService.getUserOrders(
        parseInt(userId as string)
      );
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/orders/:id
  static async getOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(parseInt(id));
      res.json(order);
    } catch (error: any) {
      if (error.message === "Order not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/orders
  static async createOrder(req: Request, res: Response) {
    try {
      const { userId, items, totalAmount } = req.body;

      if (!userId || !items) {
        return res.status(400).json({ error: "userId and items are required" });
      }

      const order = await OrderService.createOrder({
        userId,
        items,
        totalAmount,
      });

      res.status(201).json(order);
    } catch (error: any) {
      if (error.message.includes("must have at least one")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}
