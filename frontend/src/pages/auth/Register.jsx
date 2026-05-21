import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Mail, Lock, User, Phone } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const { register } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">

      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10 space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
        </div>

        {/* FORM */}
        <form className="space-y-6" onSubmit={handleSubmit}>

          <div className="space-y-5">

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

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="mt-2 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

                <input
                  type="password"
                  name="password"
                  required
                  minLength="6"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 text-sm
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
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
                  type="password"
                  name="confirmPassword"
                  required
                  minLength="6"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 text-sm
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
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