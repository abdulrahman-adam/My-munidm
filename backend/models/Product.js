import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";
import Category from "./Category.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    barcode: {
      type: DataTypes.STRING,
      unique: true,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    cost_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    // 🔥 product images (max 4)
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
      validate: {
        maxFourImages(value) {
          if (value.length > 4) {
            throw new Error("Maximum 4 images allowed");
          }
        },
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

export default Product;