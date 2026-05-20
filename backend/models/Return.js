import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

const Return = sequelize.define("Return", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  sale_id: DataTypes.INTEGER,

  product_id: DataTypes.INTEGER,

  quantity: DataTypes.INTEGER,

  reason: DataTypes.STRING,

  refund_amount: DataTypes.DECIMAL(10,2),
}, {
  tableName: "returns",
  timestamps: true,
});


export default Return;