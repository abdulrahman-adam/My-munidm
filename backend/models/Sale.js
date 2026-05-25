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

    /* =========================
       CASHIER
    ========================= */
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    cashier_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    /* =========================
       INVOICE NUMBER
    ========================= */
    invoice_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    /* =========================
       TOTAL
    ========================= */
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    /* =========================
       PAYMENT
    ========================= */
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

    /* =========================
       STATUS
    ========================= */
    status: {
      type: DataTypes.ENUM(
        "COMPLETED",
        "CANCELLED",
        "PENDING"
      ),
      defaultValue: "COMPLETED",
    },

    /* =========================
       SHIFT SYSTEM
    ========================= */
    shift_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    /* =========================
       OFFLINE MODE
    ========================= */
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

export default Sale;