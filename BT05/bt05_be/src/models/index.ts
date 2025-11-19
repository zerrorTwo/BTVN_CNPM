/**
 * Models index - Export all models
 */
import { sequelize } from "../config/database";
import { User } from "./User";
import { Category } from "./Category";
import { Product } from "./Product";

// Define associations
Category.hasMany(Product, {
  foreignKey: "categoryId",
  as: "products",
});

Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

// Export sequelize instance
export { sequelize };

// Export models
export { User, Category, Product };

export default {
  sequelize,
  User,
  Category,
  Product,
};
