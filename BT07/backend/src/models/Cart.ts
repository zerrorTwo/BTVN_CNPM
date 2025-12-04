import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Cart extends Model {
  public id!: number;
  public userId!: string;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
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
