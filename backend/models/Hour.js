import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';

const Hour = sequelize.define('OpeningHour', {
    day_of_week: {
        type: DataTypes.ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'),
        allowNull: false,
        unique: true
    },
    open_time: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: '10:00:00'
    },
    close_time: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: '22:00:00'
    },
    is_closed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { 
    timestamps: true, 
    tableName: 'opening_hours' 
});

export default Hour;