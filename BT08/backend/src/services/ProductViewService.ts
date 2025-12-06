import { ProductView, Product, ProductImage } from "../models";
import sequelize from "../config/database";

export class ProductViewService {
  static async getViewedProducts(userId: number, limit: number = 10) {
    // Get unique product IDs from recent views
    const views = await ProductView.findAll({
      attributes: [
        "productId",
        [sequelize.fn("MAX", sequelize.col("viewedAt")), "lastViewed"],
      ],
      where: { userId },
      group: ["productId"],
      order: [[sequelize.literal("lastViewed"), "DESC"]],
      limit,
      raw: true,
    });

    const productIds = (views as any[]).map((v: any) => v.productId);

    if (productIds.length === 0) {
      return [];
    }

    const products = await Product.findAll({
      where: { id: productIds },
      include: [{ model: ProductImage, as: "images" }],
    });

    // Sort products by the order of productIds
    const productMap = new Map(products.map((p) => [p.id, p]));
    const sortedProducts = productIds
      .map((id) => productMap.get(id))
      .filter(Boolean)
      .map((p: any) => {
        const productData = p.toJSON();
        const image = this.getPrimaryImage(productData.images);
        return { ...productData, image };
      });

    return sortedProducts;
  }

  static async trackView(userId: number, productId: number) {
    const view = await ProductView.create({
      userId,
      productId,
      viewedAt: new Date(),
    });

    return view;
  }

  private static getPrimaryImage(images: any[]): string {
    if (!images || images.length === 0) return "";
    const primary = images.find((img) => img.isPrimary);
    return primary ? primary.imageUrl : images[0].imageUrl;
  }
}
