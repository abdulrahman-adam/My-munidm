import express from 'express';
import { forgotPassword, resetPassword, verifyResetCode } from '../controllers/mailController.js';


const mailRouter = express.Router();

mailRouter.post('/forgot-password', forgotPassword);

mailRouter.post('/verify-reset-code', verifyResetCode);

mailRouter.post('/reset-password', resetPassword);

export default mailRouter;