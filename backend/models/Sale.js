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
    },

    invoice_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    payment_method: {
      type: DataTypes.ENUM(
        "CASH",
        "CARD",
        "MOBILE"
      ),
      defaultValue: "CASH",
    },

    payment_reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "COMPLETED",
        "CANCELLED",
        "PENDING"
      ),
      defaultValue: "COMPLETED",
    },

    shift_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    offline_synced: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "sales",
    timestamps: true,
  }
);

/* =========================
   SALE ITEM RELATION
========================= */



export default Sale;