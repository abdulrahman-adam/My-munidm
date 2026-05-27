import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

import Sale from "./Sale.js";
import Product from "./Product.js";

const SaleItem = sequelize.define(
  "SaleItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "sale_items",
    timestamps: false,
  }
);

/* =========================
   SALE RELATION
========================= */

SaleItem.belongsTo(Sale, {
  foreignKey: "sale_id",
  as: "sale",
});

/* =========================
   PRODUCT RELATION
========================= */

SaleItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "Product",
});

export default SaleItem;