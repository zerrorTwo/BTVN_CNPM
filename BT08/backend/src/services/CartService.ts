import { Cart, CartItem, Product, ProductImage } from "../models";

export class CartService {
  static async getOrCreateCart(userId: number) {
    const [cart] = await Cart.findOrCreate({
      where: { userId },
      defaults: { userId },
    });
    return cart;
  }

  static async getCartWithItems(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [
        {
          model: Product,
          as: "product",
          include: [{ model: ProductImage, as: "images" }],
        },
      ],
    });

    const items = cartItems.map((item: any) => {
      const itemData = item.toJSON();
      const product = itemData.product;
      const image =
        product.images && product.images.length > 0
          ? (
              product.images.find((img: any) => img.isPrimary) ||
              product.images[0]
            ).imageUrl
          : "";
      return {
        ...itemData,
        product: { ...product, image },
      };
    });

    return {
      cart,
      items,
      stats: this.calculateCartStats(items),
    };
  }

  static calculateCartStats(items: any[]) {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const selectedCount = items.filter((item) => item.selected).length;
    const totalPrice = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const selectedTotalPrice = items
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return {
      totalItems,
      selectedCount,
      totalPrice,
      selectedTotalPrice,
    };
  }

  static async addItemToCart(
    userId: number,
    productId: number,
    quantity: number
  ) {
    const cart = await this.getOrCreateCart(userId);

    const [cartItem, created] = await CartItem.findOrCreate({
      where: { cartId: cart.id, productId },
      defaults: {
        cartId: cart.id,
        productId,
        quantity,
        selected: true,
      },
    });

    if (!created) {
      cartItem.quantity += quantity;
      await cartItem.save();
    }

    return cartItem;
  }

  static async clearCart(userId: number) {
    const cart = await Cart.findOne({ where: { userId } });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
    }
  }
}
