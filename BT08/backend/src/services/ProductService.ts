import {
  Product,
  ProductImage,
  Favorite,
  OrderItem,
  Comment,
  Category,
} from "../models";
import { Op } from "sequelize";
import sequelize from "../config/database";

export class ProductService {
  static async getProducts(filters: any) {
    const { categoryId, minPrice, maxPrice, search, sortBy, userId } = filters;

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    let order: any[] = [];
    switch (sortBy) {
      case "PRICE_ASC":
        order = [["price", "ASC"]];
        break;
      case "PRICE_DESC":
        order = [["price", "DESC"]];
        break;
      case "NAME_ASC":
        order = [["name", "ASC"]];
        break;
      case "NAME_DESC":
        order = [["name", "DESC"]];
        break;
      case "NEWEST":
        order = [["createdAt", "DESC"]];
        break;
      default:
        order = [["id", "ASC"]];
    }

    const products = await Product.findAll({
      where,
      order,
      include: [
        { model: ProductImage, as: "images" },
        { model: Category, as: "category" },
      ],
    });

    return Promise.all(
      products.map(async (product: any) => {
        return await this.enrichProductData(product, userId);
      })
    );
  }

  static async getProductById(id: number, userId?: number) {
    const product = await Product.findByPk(id, {
      include: [
        { model: ProductImage, as: "images" },
        { model: Category, as: "category" },
      ],
    });

    if (!product) {
      return null;
    }

    return await this.enrichProductData(product, userId);
  }

  static async getSimilarProducts(productId: number, limit: number = 6) {
    const product = await Product.findByPk(productId);
    if (!product) {
      return null;
    }

    const similarProducts = await Product.findAll({
      where: {
        categoryId: product.categoryId,
        id: { [Op.ne]: productId },
      },
      include: [{ model: ProductImage, as: "images" }],
      limit,
      order: [["createdAt", "DESC"]],
    });

    return similarProducts.map((p: any) => {
      const productData = p.toJSON();
      const image = this.getPrimaryImage(productData.images);
      return { ...productData, image };
    });
  }

  private static async enrichProductData(product: any, userId?: number) {
    const productData = product.toJSON();

    // Check if favorited
    let isFavorite = false;
    if (userId) {
      const favorite = await Favorite.findOne({
        where: { userId, productId: product.id },
      });
      isFavorite = !!favorite;
    }

    // Get purchase count
    const purchaseResult = await OrderItem.findAll({
      attributes: [
        [
          sequelize.fn(
            "COUNT",
            sequelize.fn("DISTINCT", sequelize.col("order.userId"))
          ),
          "count",
        ],
      ],
      where: { productId: product.id },
      include: [
        {
          association: "order",
          attributes: [],
          required: true,
        },
      ],
      raw: true,
    });
    const purchaseCount = purchaseResult[0]
      ? parseInt((purchaseResult[0] as any).count)
      : 0;

    // Get comment count
    const commentCount = await Comment.count({
      where: { productId: product.id },
    });

    // Get average rating
    const ratingResult = await Comment.findAll({
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
      where: { productId: product.id },
      raw: true,
    });
    const averageRating = (ratingResult[0] as any)?.avgRating
      ? parseFloat((ratingResult[0] as any).avgRating)
      : null;

    const image = this.getPrimaryImage(productData.images);

    return {
      ...productData,
      isFavorite,
      purchaseCount,
      commentCount,
      averageRating,
      image,
    };
  }

  private static getPrimaryImage(images: any[]): string {
    if (!images || images.length === 0) return "";
    const primary = images.find((img) => img.isPrimary);
    return primary ? primary.imageUrl : images[0].imageUrl;
  }
}
