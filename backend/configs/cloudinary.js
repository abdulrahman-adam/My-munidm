
import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
    try {
        cloudinary.config({
            // Ensure these names match your .env file exactly!
            cloud_name: process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        
        // Quick verification log (don't log the secret!)
        console.log("Cloudinary Configured: ", process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME);
    } catch (error) {
        console.error("Cloudinary Connection Error:", error);
    }
}

export default connectCloudinary;