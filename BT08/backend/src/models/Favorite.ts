import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Favorite extends Model {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public readonly createdAt!: Date;
}

Favorite.init(
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
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "favorites",
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId"],
      },
    ],
  }
);

export default Favorite;
