import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Order extends Model {
  public id!: number;
  public userId!: number;
  public totalAmount!: number;
  public status!: "pending" | "completed" | "cancelled";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public items?: any[];
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: true,
  }
);

export default Order;
