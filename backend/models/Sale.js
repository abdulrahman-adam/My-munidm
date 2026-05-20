import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

const Sale = sequelize.define("Sale", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  user_id: { type: DataTypes.INTEGER, allowNull: false },

  total: { type: DataTypes.DECIMAL(10,2), allowNull: false },

  payment_method: {
    type: DataTypes.ENUM("CASH", "CARD", "MOBILE"),
    defaultValue: "CASH",
  },

  status: {
    type: DataTypes.ENUM("COMPLETED", "CANCELLED"),
    defaultValue: "COMPLETED",
  },
}, {
  tableName: "sales",
  timestamps: true,
});


export default Sale;