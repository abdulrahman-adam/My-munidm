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
      onDelete: "CASCADE",
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    barcode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    cost_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },

    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    images: {
      type: DataTypes.JSON,
      defaultValue: [],
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
    underscored: true,
  }
);

/* =========================
   ASSOCIATIONS (IMPORTANT)
========================= */

Category.hasMany(Product, {
  foreignKey: "category_id",
  as: "products",
});

Product.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

export default Product;