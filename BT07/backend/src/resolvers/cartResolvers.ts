import { Product, CartItem, Cart, ProductImage } from "../models";

export const cartQuery = {
  cart: async (_: any, { userId }: { userId: string }) => {
    // First, find or create the cart for this user
    const [cart] = await Cart.findOrCreate({
      where: { userId: userId },
      defaults: { userId: userId },
    });

    // Get all cart items for this cart
    const items = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [
        {
          model: Product,
          as: "product",
          include: [{ model: ProductImage, as: "images" }],
        },
      ],
    });

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const selectedCount = items
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) =>
        sum + item.quantity * parseFloat(item.product!.price.toString()),
      0
    );
    const selectedTotalPrice = items
      .filter((item) => item.selected)
      .reduce(
        (sum, item) =>
          sum + item.quantity * parseFloat(item.product!.price.toString()),
        0
      );

    return {
      items,
      totalItems,
      selectedCount,
      totalPrice,
      selectedTotalPrice,
    };
  },
};

export const cartMutations = {
  addToCart: async (
    _: any,
    {
      userId,
      productId,
      quantity,
    }: { userId: string; productId: number; quantity: number }
  ) => {
    // Find or create the cart for this user
    const [cart] = await Cart.findOrCreate({
      where: { userId: userId },
      defaults: { userId: userId },
    });

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return await CartItem.findOne({
        where: { id: existingItem.id },
        include: [
          {
            model: Product,
            as: "product",
            include: [{ model: ProductImage, as: "images" }],
          },
        ],
      });
    }

    const newItem = await CartItem.create({
      cartId: cart.id,
      productId,
      quantity,
      selected: false,
    });

    return await CartItem.findOne({
      where: { id: newItem.id },
      include: [
        {
          model: Product,
          as: "product",
          include: [{ model: ProductImage, as: "images" }],
        },
      ],
    });
  },

  updateCartItem: async (
    _: any,
    {
      id,
      quantity,
      selected,
    }: { id: number; quantity?: number; selected?: boolean }
  ) => {
    const item = await CartItem.findByPk(id);
    if (!item) throw new Error("Cart item not found");

    if (quantity !== undefined) item.quantity = quantity;
    if (selected !== undefined) item.selected = selected;

    await item.save();

    return await CartItem.findOne({
      where: { id },
      include: [
        {
          model: Product,
          as: "product",
          include: [{ model: ProductImage, as: "images" }],
        },
      ],
    });
  },

  removeCartItem: async (_: any, { id }: { id: number }) => {
    const item = await CartItem.findByPk(id);
    if (!item) throw new Error("Cart item not found");

    await item.destroy();
    return true;
  },

  removeMultipleItems: async (_: any, { ids }: { ids: number[] }) => {
    await CartItem.destroy({
      where: { id: ids },
    });
    return true;
  },

  selectItemsForCheckout: async (
    _: any,
    { userId, itemIds }: { userId: string; itemIds: number[] }
  ) => {
    // Find the cart for this user
    const cart = await Cart.findOne({
      where: { userId: userId },
    });

    if (!cart) throw new Error("Cart not found");

    // Deselect all items in this cart first
    await CartItem.update({ selected: false }, { where: { cartId: cart.id } });

    // Select only the specified items
    await CartItem.update(
      { selected: true },
      { where: { id: itemIds, cartId: cart.id } }
    );

    // Get updated cart items
    const items = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [
        {
          model: Product,
          as: "product",
          include: [{ model: ProductImage, as: "images" }],
        },
      ],
    });

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const selectedCount = items
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) =>
        sum + item.quantity * parseFloat(item.product!.price.toString()),
      0
    );
    const selectedTotalPrice = items
      .filter((item) => item.selected)
      .reduce(
        (sum, item) =>
          sum + item.quantity * parseFloat(item.product!.price.toString()),
        0
      );

    return {
      items,
      totalItems,
      selectedCount,
      totalPrice,
      selectedTotalPrice,
    };
  },

  clearCart: async (_: any, { userId }: { userId: string }) => {
    // Find the cart for this user
    const cart = await Cart.findOne({
      where: { userId: userId },
    });

    if (!cart) return true; // Already empty

    await CartItem.destroy({
      where: { cartId: cart.id },
    });
    return true;
  },
};
