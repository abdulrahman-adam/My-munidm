import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState('');

    const [code, setCode] = useState(
        ['', '', '', '', '', '', '', '']
    );

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);



    // SEND EMAIL
    const sendCode = async () => {

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return alert('Invalid email');
        }

        try {

            setLoading(true);

            const res = await axios.post(
                'http://localhost:4000/api/auth/forgot-password',
                { email }
            );

            alert(res.data.message);

            setStep(2);

        } catch (error) {
            alert(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };



    // VERIFY CODE
    const verifyCode = async () => {

        const finalCode = code.join('');

        try {

            setLoading(true);

            const res = await axios.post(
                'http://localhost:4000/api/auth/verify-reset-code',
                {
                    email,
                    code: finalCode
                }
            );

            alert(res.data.message);

            setStep(3);

        } catch (error) {
            alert(error.response?.data?.message || 'Invalid code');
        } finally {
            setLoading(false);
        }
    };



    // RESET PASSWORD
    const changePassword = async () => {

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(password)) {
            return alert(
                'Password must contain uppercase, lowercase, number and minimum 8 characters'
            );
        }

        if (password !== confirmPassword) {
            return alert('Passwords do not match');
        }

        try {

            setLoading(true);

            const res = await axios.post(
                'http://localhost:4000/api/auth/reset-password',
                {
                    email,
                    password
                }
            );

            alert(res.data.message);

            window.location.href = '/';

        } catch (error) {
            alert(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };



    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">

                {/* LOGO / TITLE */}
                <div className="text-center mb-8">

                    <h1 className="text-4xl font-extrabold text-white mb-3">
                        Ayacodia
                    </h1>

                    <p className="text-gray-300 text-sm">
                        Secure password recovery system
                    </p>

                </div>



                {/* STEP INDICATOR */}
                <div className="flex justify-center items-center gap-3 mb-10">

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                        ${step >= 1
                            ? 'bg-white text-black'
                            : 'bg-gray-700 text-white'
                        }`}>
                        1
                    </div>

                    <div className="w-10 h-1 bg-gray-600 rounded"></div>

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                        ${step >= 2
                            ? 'bg-white text-black'
                            : 'bg-gray-700 text-white'
                        }`}>
                        2
                    </div>

                    <div className="w-10 h-1 bg-gray-600 rounded"></div>

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                        ${step >= 3
                            ? 'bg-white text-black'
                            : 'bg-gray-700 text-white'
                        }`}>
                        3
                    </div>

                </div>



                {/* STEP 1 */}
                {step === 1 && (

                    <div className="space-y-6">

                        <div className="text-center">

                            <h2 className="text-2xl font-bold text-white mb-2">
                                Forgot Password
                            </h2>

                            <p className="text-gray-400 text-sm">
                                Enter your email to receive verification code
                            </p>

                        </div>

                        <div>

                            <label className="text-sm text-gray-300 mb-2 block">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="
                                    w-full
                                    bg-white/10
                                    border
                                    border-gray-600
                                    focus:border-white
                                    text-white
                                    rounded-xl
                                    px-4
                                    py-4
                                    outline-none
                                    transition
                                    duration-300
                                    placeholder:text-gray-500
                                "
                            />

                        </div>

                        <button
                            onClick={sendCode}
                            disabled={loading}
                            className="
                                w-full
                                bg-white
                                hover:bg-gray-200
                                text-black
                                font-bold
                                py-4
                                rounded-xl
                                transition-all
                                duration-300
                                shadow-lg
                                hover:scale-[1.02]
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? 'Sending...'
                                : 'Send Verification Code'}
                        </button>

                    </div>
                )}



                {/* STEP 2 */}
                {step === 2 && (

                    <div className="space-y-6">

                        <div className="text-center">

                            <h2 className="text-2xl font-bold text-white mb-2">
                                Verification Code
                            </h2>

                            <p className="text-gray-400 text-sm">
                                Enter the 8-digit code sent to your email
                            </p>

                        </div>

                        <div className="flex justify-center gap-2 flex-wrap">

                            {code.map((item, index) => (

                                <input
                                    key={index}
                                    maxLength={1}
                                    value={item}
                                    onChange={(e) => {

                                        const value =
                                            e.target.value.toUpperCase();

                                        const regex = /^[A-Z0-9]?$/;

                                        if (!regex.test(value)) return;

                                        const newCode = [...code];

                                        newCode[index] = value;

                                        setCode(newCode);

                                        // Auto focus next input
                                        if (
                                            value &&
                                            e.target.nextSibling
                                        ) {
                                            e.target.nextSibling.focus();
                                        }
                                    }}
                                    className="
                                        w-12
                                        h-14
                                        text-center
                                        text-xl
                                        font-bold
                                        bg-white/10
                                        border
                                        border-gray-600
                                        focus:border-white
                                        text-white
                                        rounded-xl
                                        outline-none
                                        transition-all
                                        duration-300
                                    "
                                />
                            ))}

                        </div>

                        <button
                            onClick={verifyCode}
                            disabled={loading}
                            className="
                                w-full
                                bg-white
                                hover:bg-gray-200
                                text-black
                                font-bold
                                py-4
                                rounded-xl
                                transition-all
                                duration-300
                                shadow-lg
                                hover:scale-[1.02]
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? 'Verifying...'
                                : 'Verify Code'}
                        </button>

                    </div>
                )}



                {/* STEP 3 */}
                {step === 3 && (

                    <div className="space-y-6">

                        <div className="text-center">

                            <h2 className="text-2xl font-bold text-white mb-2">
                                Reset Password
                            </h2>

                            <p className="text-gray-400 text-sm">
                                Create a new secure password
                            </p>

                        </div>

                        <div>

                            <label className="text-sm text-gray-300 mb-2 block">
                                New Password
                            </label>

                            <input
                                type="password"
                                placeholder="New password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                className="
                                    w-full
                                    bg-white/10
                                    border
                                    border-gray-600
                                    focus:border-white
                                    text-white
                                    rounded-xl
                                    px-4
                                    py-4
                                    outline-none
                                    transition
                                    duration-300
                                    placeholder:text-gray-500
                                "
                            />

                        </div>

                        <div>

                            <label className="text-sm text-gray-300 mb-2 block">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="
                                    w-full
                                    bg-white/10
                                    border
                                    border-gray-600
                                    focus:border-white
                                    text-white
                                    rounded-xl
                                    px-4
                                    py-4
                                    outline-none
                                    transition
                                    duration-300
                                    placeholder:text-gray-500
                                "
                            />

                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">

                            <p className="text-gray-300 text-sm leading-6">
                                Password must contain:
                            </p>

                            <ul className="text-gray-400 text-sm mt-2 space-y-1">
                                <li>• Minimum 8 characters</li>
                                <li>• One uppercase letter</li>
                                <li>• One lowercase letter</li>
                                <li>• One number</li>
                            </ul>

                        </div>

                        <button
                            onClick={changePassword}
                            disabled={loading}
                            className="
                                w-full
                                bg-white
                                hover:bg-gray-200
                                text-black
                                font-bold
                                py-4
                                rounded-xl
                                transition-all
                                duration-300
                                shadow-lg
                                hover:scale-[1.02]
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? 'Updating...'
                                : 'Change Password'}
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
};

export default ForgotPassword;