import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 50],
            is: /^[A-Za-z\s]+$/i
        }
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            is: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/
        }
    },

    role: {
        type: DataTypes.ENUM('USER', 'ADMIN'),
        defaultValue: 'USER',
    },

    cartItems: {
        type: DataTypes.JSON,
        defaultValue: {},
    },

    resetCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    resetCodeExpire: {
        type: DataTypes.DATE,
        allowNull: true,
    }

}, {
    timestamps: true,
});

export default User;