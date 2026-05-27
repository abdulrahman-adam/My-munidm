import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

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

/* ONLY RELATIONS HERE */
SaleItem.associate = (models) => {
  SaleItem.belongsTo(models.Sale, {
    foreignKey: "sale_id",
    as: "sale",
  });

  SaleItem.belongsTo(models.Product, {
    foreignKey: "product_id",
    as: "product",
  });
};

export default SaleItem;