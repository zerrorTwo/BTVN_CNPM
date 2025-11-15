/**
 * Models index - Export all models
 */
import { sequelize } from "../config/database";
import { User } from "./User";

// Export sequelize instance
export { sequelize };

// Export models
export { User };

// Initialize associations here if needed
// Example: User.hasMany(Post);

export default {
  sequelize,
  User,
};
