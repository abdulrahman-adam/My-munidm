

import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, 
        dialectOptions: {
            connectTimeout: 60000,
            // 1. THIS IS THE CORRECT WAY to handle large packets 
            // without needing SUPER privileges:
            charset: 'utf8mb4',
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 60000,
            idle: 10000
        },
        // 2. Add this to prevent timezone privilege errors
        timezone: '+00:00', 
        retry: {
            match: [
                /read ECONNRESET/,
                /ETIMEDOUT/,
                /max_allowed_packet/
            ],
            max: 3 
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database Connected (MySQL)');
        
        // 3. REMOVED: await sequelize.query("SET GLOBAL max_allowed_packet...");
        // You cannot run SET GLOBAL on a VPS MySQL without root/super access.
        // If you need larger packets, you must edit /etc/mysql/my.cnf on the VPS itself.
        
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
    }
};

export { sequelize };
export default connectDB;