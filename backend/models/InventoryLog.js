import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

const InventoryLog = sequelize.define("InventoryLog", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  product_id: { type: DataTypes.INTEGER, allowNull: false },

  user_id: { type: DataTypes.INTEGER, allowNull: false },

  type: {
    type: DataTypes.ENUM("IN", "OUT", "ADJUSTMENT"),
    allowNull: false,
  },

  quantity: { type: DataTypes.INTEGER, allowNull: false },

  reason: DataTypes.STRING,
}, {
  tableName: "inventory_logs",
  timestamps: true,
});


export default InventoryLog;