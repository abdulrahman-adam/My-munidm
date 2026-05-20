import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';

const Partenaire = sequelize.define('Partenaire', {
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    siret: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            // Validates that the SIRET is exactly 14 digits
            is: /^\d{14}$/
        }
    },
    profession: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'The industry or sector of the partner'
    },
    contactEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Why they want to become a partner'
    }
}, { 
    timestamps: true, 
    tableName: 'partenaires' 
});

export default Partenaire;