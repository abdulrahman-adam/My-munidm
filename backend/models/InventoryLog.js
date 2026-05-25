import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

const InventoryLog = sequelize.define(
  "InventoryLog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    /* =========================
       RELATIONS
    ========================= */
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    /* =========================
       LOG TYPE
    ========================= */
    type: {
      type: DataTypes.ENUM("IN", "OUT", "ADJUSTMENT"),
      allowNull: false,
    },

    /* =========================
       QUANTITY CHANGE
    ========================= */
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    /* =========================
       OPTIONAL REASON
    ========================= */
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "inventory_logs",
    timestamps: true,
  }
);

export default InventoryLog;