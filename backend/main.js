
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import 'dotenv/config';

import connectDB, { sequelize } from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

// Routes
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import contactRouter from "./routes/contactRoute.js";
import hourRouter from "./routes/hourRoute.js";
import Hour from "./models/Hour.js";
import partenaireRouter from "./routes/partenaireRoute.js";
import mailRouter from "./routes/mailRoute.js";

const app = express();
const port = process.env.PORT || 4000;

await connectDB();
// --- ADD THIS SECTION HERE ---
// This creates the 'Contacts' table if it doesn't exist
try {
    await sequelize.sync({ alter: true });
    console.log("✅ MySQL Tables Synchronized");
} catch (error) {
    console.error("❌ MySQL Sync Error:", error);
}


connectCloudinary();



// Add all versions of your domain here
const allowedOrigins = [
  'https://munidm.fr',
  'https://www.munidm.fr',
  'https://api.munidm.fr', // Add this!
  'https://db.munidm.fr',   // Add this!
  'http://localhost:5173',
  'http://localhost:5174',
  'http://109.176.199.234:5173'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); // This helps you debug in logs
      callback(new Error('CORS Policy Error'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle pre-flight for mobile

// 3. INFRASTRUCTURE (Cookies must be parsed before auth middleware runs)
app.use(cookieParser());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Oening Hours
// --- UPDATED SECTION IN main.js ---
try {
    await sequelize.sync({ alter: true });
    console.log("✅ MySQL Tables Synchronized");

    
    // Check if table is empty and seed it automatically
    const count = await Hour.count();
    if (count === 0) {
        const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        const batch = days.map(day => ({
            day_of_week: day,
            open_time: '10:00:00',
            close_time: '22:00:00',
            is_closed: false
        }));
        await Hour.bulkCreate(batch);
        console.log("✨ Miracle! Opening hours auto-initialized.");
    }
} catch (error) {
    console.error("❌ MySQL Sync/Seed Error:", error);
}

// 4. API ROUTES
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/contact', contactRouter);
app.use('/api/partenaire', partenaireRouter);
app.use('/api/hours', hourRouter);
app.use('/api/auth', mailRouter);

app.get('/', (req, res) => res.send("API IS WORKING NOW"));

// Global Error Handler to catch "Layer" crashes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal Server Error" });      
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



// Hierarchical E-commerce Category Architecture (Tree Structure)

// or ✅ Nested Category Structure (Category → Subcategory → Sub-subcategory)

