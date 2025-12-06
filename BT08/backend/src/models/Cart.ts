import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Cart extends Model {
  public id!: number;
  public userId!: number;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "carts",
    timestamps: true,
  }
);

export default Cart;
