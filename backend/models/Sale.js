import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

const Sale = sequelize.define(
  "Sale",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    cashier_name: {
      type: DataTypes.STRING,
      allowNull: true,
      trim: true,
    },

    invoice_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    payment_method: {
      type: DataTypes.ENUM("CASH", "CARD", "MOBILE"),
      defaultValue: "CASH",
    },

    payment_reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("COMPLETED", "CANCELLED", "PENDING"),
      defaultValue: "COMPLETED",
    },

    shift_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    sale_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    offline_synced: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "sales",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

/* =========================
   ASSOCIATIONS
   (ONLY KEEP HERE)
========================= */

Sale.associate = (models) => {
  Sale.hasMany(models.SaleItem, {
    foreignKey: "sale_id",
    as: "items",
    onDelete: "CASCADE",
    hooks: true,
  });
};

export default Sale;