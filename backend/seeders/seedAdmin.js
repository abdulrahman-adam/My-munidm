import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // Adjust path to your User model

// Load variables from .env
dotenv.config();

const createAdmin = async () => {
  try {
    // 1. Security Guard: Prevent accidental production use
    if (process.env.NODE_ENV === 'production') {
      console.error("SECURITY ALERT: Seed script disabled in production.");
      process.exit(1);
    }

    // 2. Check if admin already exists
    const adminExists = await User.findOne({ where: { role: "ADMIN" } });
    if (adminExists) {
      console.log("Admin user already exists. Skipping.");
      return;
    }

    // 3. Validation: Ensure environment variables are present
    const { SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_PHONE } = process.env;
    if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
      throw new Error("Missing admin credentials in .env file");
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);

    // 5. Create the admin user
    await User.create({
      name: SEED_ADMIN_NAME,
      email: SEED_ADMIN_EMAIL,
      phone: SEED_ADMIN_PHONE,
      password_hash: hashedPassword,
      role: "ADMIN",
      is_active: true
    });

    console.log("Admin user created successfully!");
  } catch (error) {
    console.error("Error creating admin:", error.message);
  }
};

createAdmin();


// npm run seed:admin