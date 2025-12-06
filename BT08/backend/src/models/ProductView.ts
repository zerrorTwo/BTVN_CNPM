import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class ProductView extends Model {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public readonly viewedAt!: Date;
}

ProductView.init(
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
    viewedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "product_views",
    timestamps: false,
    indexes: [
      {
        fields: ["userId", "viewedAt"],
      },
      {
        fields: ["productId"],
      },
    ],
  }
);

export default ProductView;
