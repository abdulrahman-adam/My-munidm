import express from "express";

import { forgotPassword, login, me, resetPassword, sendOtp, verifyOtp, verifyResetOtp } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";


const authRouter = express.Router();

authRouter.post("/login", login);

/* GET CURRENT USER */
authRouter.get("/me", protect, me);

// optional OTP system
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);


authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-reset-otp", verifyResetOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;