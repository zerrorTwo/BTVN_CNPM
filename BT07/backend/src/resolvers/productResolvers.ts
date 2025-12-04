import { Product, ProductImage } from "../models";
import { Op } from "sequelize";

interface ProductFilter {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "PRICE_ASC" | "PRICE_DESC" | "NAME_ASC" | "NAME_DESC" | "NEWEST";
}

export const productQuery = {
  products: async (_: any, { filter }: { filter?: ProductFilter }) => {
    const where: any = {};

    // Category filter
    if (filter?.categoryId) {
      where.categoryId = filter.categoryId;
    }

    // Price range filter
    if (filter?.minPrice !== undefined || filter?.maxPrice !== undefined) {
      where.price = {};
      if (filter.minPrice !== undefined) {
        where.price[Op.gte] = filter.minPrice;
      }
      if (filter.maxPrice !== undefined) {
        where.price[Op.lte] = filter.maxPrice;
      }
    }

    // Search filter (name or description)
    if (filter?.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${filter.search}%` } },
        { description: { [Op.like]: `%${filter.search}%` } },
      ];
    }

    // Sort order
    let order: any[] = [];
    switch (filter?.sortBy) {
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

    return await Product.findAll({
      where,
      order,
      include: [{ model: ProductImage, as: "images" }],
    });
  },
};

export const productFieldResolvers = {
  image: (parent: any) => {
    // Return the primary image URL, or the first image, or empty string
    if (parent.images && parent.images.length > 0) {
      const primaryImage = parent.images.find((img: any) => img.isPrimary);
      return primaryImage ? primaryImage.imageUrl : parent.images[0].imageUrl;
    }
    return "";
  },
};
