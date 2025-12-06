import User from "./User";
import Category from "./Category";
import Product from "./Product";
import Cart from "./Cart";
import CartItem from "./CartItem";
import ProductImage from "./ProductImage";
import Favorite from "./Favorite";
import ProductView from "./ProductView";
import Order from "./Order";
import OrderItem from "./OrderItem";
import Comment from "./Comment";

// User relationships
User.hasOne(Cart, { foreignKey: "userId", as: "cart" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

// Category relationships
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Product relationships
Product.hasMany(ProductImage, { foreignKey: "productId", as: "images" });
ProductImage.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Cart relationships
Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

// CartItem relationships
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });
Product.hasMany(CartItem, { foreignKey: "productId", as: "cartItems" });

// Favorite relationships
User.hasMany(Favorite, { foreignKey: "userId", as: "favorites" });
Favorite.belongsTo(User, { foreignKey: "userId", as: "user" });
Product.hasMany(Favorite, { foreignKey: "productId", as: "favorites" });
Favorite.belongsTo(Product, { foreignKey: "productId", as: "product" });

// ProductView relationships
User.hasMany(ProductView, { foreignKey: "userId", as: "productViews" });
ProductView.belongsTo(User, { foreignKey: "userId", as: "user" });
Product.hasMany(ProductView, { foreignKey: "productId", as: "views" });
ProductView.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Order relationships
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// OrderItem relationships
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });

// Comment relationships
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });
Product.hasMany(Comment, { foreignKey: "productId", as: "comments" });
Comment.belongsTo(Product, { foreignKey: "productId", as: "product" });

export {
  User,
  Category,
  Product,
  Cart,
  CartItem,
  ProductImage,
  Favorite,
  ProductView,
  Order,
  OrderItem,
  Comment,
};
