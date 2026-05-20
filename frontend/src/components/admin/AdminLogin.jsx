import React, { useEffect, useState } from 'react'
import { useAppContext } from "../../context/AppContext"
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const { isSeller, setIsSeller, navigate, axios } = useAppContext();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();

            // ✅ EMAIL REGEX
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // ✅ PASSWORD REGEX (min 6 chars, letter + number)
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

            if (!emailRegex.test(email)) {
                toast.error("Invalid email format");
                return;
            }

            if (!passwordRegex.test(password)) {
                toast.error("Password must be at least 6 chars with letters & numbers");
                return;
            }

            const { data } = await axios.post("/api/seller/login", { email, password });

            if (data.success) {
                setIsSeller(true);
                navigate("/admin");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (isSeller) {
            navigate("/admin")
        }
    }, [isSeller])

    return !isSeller && (
        <form
            onSubmit={onSubmitHandler}
            className="flex items-center justify-center bg-gray-50 px-4 text-sm text-gray-600 my-8 py-6 pb-8"
        >
            <div
                className="flex flex-col gap-6 w-full max-w-md sm:max-w-lg
                items-start p-6 sm:p-8 py-8 sm:py-10
                rounded-2xl shadow-2xl border border-gray-100 bg-white transition-all duration-300"
            >
                <p className="text-xl sm:text-2xl font-bold m-auto text-gray-800">
                    <span className="text-blue-500">Admin</span> Login
                </p>

                {/* EMAIL */}
                <div className="w-full">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full h-11 px-3 border border-gray-200 rounded-lg bg-gray-50
                        focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all outline-none"
                        required
                    />
                </div>

                {/* PASSWORD */}
                <div className="w-full">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        placeholder="Enter your password"
                        className="w-full h-11 px-3 border border-gray-200 rounded-lg bg-gray-50
                        focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all outline-none"
                        required
                    />
                </div>

                {/* BUTTON */}
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full py-3 rounded-lg
                    font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                    Login
                </button>
            </div>
        </form>
    )
}

export default AdminLogin