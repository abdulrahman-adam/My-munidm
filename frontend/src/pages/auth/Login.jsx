import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Mail, Lock, Calculator } from "lucide-react";

export default function Login() {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    await login(formData); // navigation already handled in context
  } catch (error) {
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">

      <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10 space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <Calculator className="mx-auto h-12 w-12 text-blue-600" />

          <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>

          <p className="mt-2 inline-block px-4 py-1 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse shadow-lg">
            Fancymarket
          </p>
        </div>

        {/* FORM */}
        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>

            <div className="mt-2 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

              <input
                type="email"
                required
                placeholder="admin@smartpos.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 text-sm
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="mt-2 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 text-sm
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500 transition"
            >
              Forgot your password?
            </Link>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-md text-white font-medium
            bg-blue-600 hover:bg-blue-700 transition
            disabled:bg-blue-400 flex items-center justify-center"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

        </form>
      </div>
    </div>
  );
}