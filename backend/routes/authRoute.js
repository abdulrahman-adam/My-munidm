import express from "express";
import { login, register } from "../controllers/userController";
import { forgotPassword, resetPassword, sendOtp, verifyOtp, verifyResetOtp } from "../controllers/authController";


const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

// optional OTP system
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);


authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-reset-otp", verifyResetOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;