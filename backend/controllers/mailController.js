import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { transporter } from '../configs/email.js';

const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let code = '';

    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return code;
};



// SEND RESET CODE
export const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Email not found'
            });
        }

        const code = generateCode();

        user.resetCode = code;
        user.resetCodeExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code',
            html: `
                <h2>Password Reset</h2>
                <h1>${code}</h1>
                <p>This code expires in 10 minutes.</p>
            `
        });

        res.status(200).json({
            success: true,
            message: 'Verification code sent to email'
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// VERIFY CODE
export const verifyResetCode = async (req, res) => {

    try {

        const { email, code } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.resetCode !== code) {
            return res.status(400).json({
                success: false,
                message: 'Invalid code'
            });
        }

        if (new Date(user.resetCodeExpire) < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Code expired'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Code verified'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




// RESET PASSWORD
export const resetPassword = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        user.resetCode = null;
        user.resetCodeExpire = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};