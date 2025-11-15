/**
 * Sequelize database instance
 */
import { Sequelize } from "sequelize";
import sequelizeConfig from "./sequelize.config";

// Get environment configuration
const env = (process.env.NODE_ENV ||
  "development") as keyof typeof sequelizeConfig;
const config = sequelizeConfig[env];

// Initialize Sequelize instance
export const sequelize = new Sequelize(
  config.database,
  config.username || "root",
  config.password || "",
  {
    host: config.host || "localhost",
    port: config.port || 3306,
    dialect: "mysql",
    logging: config.logging,
    pool: config.pool,
  }
);

// Test connection
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("✓ Database connected successfully");
  } catch (error) {
    console.error("✗ Database connection failed:", error);
    throw error;
  }
};

export default sequelize;
