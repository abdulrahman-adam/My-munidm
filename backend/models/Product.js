import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

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
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    barcode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    cost_price: {
      type: DataTypes.DECIMAL(10, 2),
    },

    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    images: {
      type: DataTypes.JSON,
      defaultValue: [],
    },

    description: {
      type: DataTypes.TEXT,
    },

    expiration_date: {
      type: DataTypes.DATE,
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
   ASSOCIATIONS (MOVE SAFE)
========================= */

Product.associate = (models) => {
  Product.belongsTo(models.Category, {
    foreignKey: "category_id",
    as: "category",
  });

  Product.hasMany(models.InventoryLog, {
    foreignKey: "product_id",
    as: "inventoryLogs",
  });

  Product.hasMany(models.SaleItem, {
    foreignKey: "product_id",
    as: "saleItems",
  });
};

export default Product;