



import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Adjust the path to your User model

const authSeller = async (req, res, next) => {
    try {
        const { sellerToken } = req.cookies;

        if (!sellerToken) {
            return res.json({ success: false, message: "Non autorisé, veuillez vous connecter." }); 
        }

        // 1. Decode the token
        const token_decode = jwt.verify(sellerToken, process.env.JWT_SECRET);
        
        // 2. Find the user in DB and check the role
        const user = await User.findByPk(token_decode.id);

        if (!user || user.role !== 'ADMIN') {
            return res.json({ success: false, message: "Accès refusé: Réservé aux administrateurs." });
        }

        // 3. Attach admin info to request for the next function
        req.sellerId = user.id; 
        next();
    } catch (error) {
        console.error("Auth Error:", error.message);
        res.json({ success: false, message: "Session expirée." });
    }
};

export default authSeller;