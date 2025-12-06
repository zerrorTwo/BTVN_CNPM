import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Comment extends Model {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public content!: string;
  public rating!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public user?: any;
}

Comment.init(
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    sequelize,
    tableName: "comments",
    timestamps: true,
  }
);

export default Comment;
