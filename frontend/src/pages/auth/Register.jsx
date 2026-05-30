import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Mail, Lock, User, Phone, Eye, EyeOff, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const { register, isAdmin } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "CASHIER", // DEFAULT ROLE
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // SHOW / HIDE PASSWORD STATES
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    const { confirmPassword, ...dataToSend } = formData;
    await register(dataToSend);

    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="overflow-y-auto flex items-start lg:items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

      {/* CARD */}
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl bg-white shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8 space-y-6">

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
        </div>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <div className="mt-2 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 text-sm
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>

              <div className="mt-2 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@smartpos.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 text-sm
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>

              <div className="mt-2 relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 text-sm
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* ROLE (ONLY ADMIN CAN SEE) */}
            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-3 rounded-md border border-gray-300 text-sm
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="CASHIER">CASHIER</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            )}

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="mt-2 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength="6"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 rounded-md border border-gray-300 text-sm
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <div className="mt-2 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  minLength="6"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 rounded-md border border-gray-300 text-sm
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-md text-white font-medium
            bg-blue-600 hover:bg-blue-700 transition
            disabled:bg-blue-400"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>

        </form>
      </div>
    </div>
  );
}