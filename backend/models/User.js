import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },

    email: {
      type: DataTypes.STRING(100),
      // unique: true,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },

    phone: {
      type: DataTypes.STRING(20),
      // unique: true,
      allowNull: true,
    },

    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("CASHIER", "ADMIN", "MANAGER"),
      defaultValue: "CASHIER",
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    otp_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },

    otp_expire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "users",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default User;