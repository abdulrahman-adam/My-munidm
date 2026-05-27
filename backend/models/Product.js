import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

import Category from "./Category.js";
import InventoryLog from "./InventoryLog.js";
import SaleItem from "./SaleItem.js";

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

    expiration_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    expiry_notification_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
   CATEGORY RELATION
========================= */

Category.hasMany(Product, {
  foreignKey: "category_id",
  as: "products",
});

Product.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

/* =========================
   INVENTORY LOG RELATION
========================= */

Product.hasMany(InventoryLog, {
  foreignKey: "product_id",
  as: "inventoryLogs",
});

InventoryLog.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

/* =========================
   SALE ITEM RELATION
========================= */

Product.hasMany(SaleItem, {
  foreignKey: "product_id",
  as: "saleItems",
});

export default Product;