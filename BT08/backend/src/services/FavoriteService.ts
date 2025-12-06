import { Favorite, Product, ProductImage } from "../models";

export class FavoriteService {
  static async getUserFavorites(userId: number) {
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
          include: [{ model: ProductImage, as: "images" }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return favorites.map((fav: any) => {
      const product = fav.product.toJSON();
      const image = this.getPrimaryImage(product.images);
      return { ...product, image, isFavorite: true };
    });
  }

  static async addFavorite(userId: number, productId: number) {
    const [favorite, created] = await Favorite.findOrCreate({
      where: { userId, productId },
      defaults: { userId, productId },
    });

    return { favorite, created };
  }

  static async removeFavorite(userId: number, productId: number) {
    const deleted = await Favorite.destroy({
      where: { userId, productId },
    });

    return deleted > 0;
  }

  static async isFavorite(userId: number, productId: number): Promise<boolean> {
    const favorite = await Favorite.findOne({
      where: { userId, productId },
    });
    return !!favorite;
  }

  private static getPrimaryImage(images: any[]): string {
    if (!images || images.length === 0) return "";
    const primary = images.find((img) => img.isPrimary);
    return primary ? primary.imageUrl : images[0].imageUrl;
  }
}
