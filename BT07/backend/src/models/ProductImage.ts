import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class ProductImage extends Model {
  public id!: number;
  public productId!: number;
  public imageUrl!: string;
  public isPrimary!: boolean;
  public displayOrder!: number;
}

ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'product_images',
    timestamps: true,
  }
);

export default ProductImage;
