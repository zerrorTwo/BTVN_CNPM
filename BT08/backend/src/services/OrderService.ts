import { Order, OrderItem, Product, ProductImage } from "../models";

export class OrderService {
  static async getUserOrders(userId: number) {
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              include: [{ model: ProductImage, as: "images" }],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const ordersWithImages = orders.map((order: any) => {
      const orderData = order.toJSON();
      return {
        ...orderData,
        items: orderData.items.map((item: any) => {
          const image = this.getPrimaryImage(item.product.images);
          return {
            ...item,
            product: { ...item.product, image },
          };
        }),
      };
    });

    return ordersWithImages;
  }

  static async getOrderById(id: number) {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              include: [{ model: ProductImage, as: "images" }],
            },
          ],
        },
      ],
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }

  static async createOrder(data: {
    userId: number;
    items: Array<{ productId: number; quantity: number; price: number }>;
    totalAmount?: number;
  }) {
    if (!data.items || data.items.length === 0) {
      throw new Error("Order must have at least one item");
    }

    const order = await Order.create({
      userId: data.userId,
      totalAmount: data.totalAmount || 0,
      status: "pending",
    });

    // Create order items
    await Promise.all(
      data.items.map((item) =>
        OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })
      )
    );

    const orderWithItems = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    return orderWithItems;
  }

  private static getPrimaryImage(images: any[]): string {
    if (!images || images.length === 0) return "";
    const primary = images.find((img) => img.isPrimary);
    return primary ? primary.imageUrl : images[0].imageUrl;
  }
}
