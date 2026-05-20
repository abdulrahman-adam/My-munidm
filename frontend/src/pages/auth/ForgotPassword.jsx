import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Mail, Lock, KeyRound, ArrowLeft, Calculator } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const { forgotPassword, verifyResetOtp, resetPassword } = useAppContext();
  
  // Controls which step of the reset process the user is on (1: Email, 2: OTP, 3: New Password)
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  /* =========================================================
     STEP 1: REQUEST OTP
  ========================================================= */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await forgotPassword(email);
    
    // Move to step 2 assuming the email was sent
    setStep(2);
    setIsSubmitting(false);
  };

  /* =========================================================
     STEP 2: VERIFY OTP
  ========================================================= */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await verifyResetOtp({ email, otp });
    
    // Move to step 3 assuming OTP was correct
    setStep(3);
    setIsSubmitting(false);
  };

  /* =========================================================
     STEP 3: RESET PASSWORD
  ========================================================= */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    
    await resetPassword({ 
      email, 
      otp, 
      newPassword: passwords.newPassword 
    });
    
    // AppContext's resetPassword function automatically navigates to /login on success
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-xl border border-gray-100 relative">
        
        {/* Back Button */}
        {step === 1 ? (
          <Link to="/login" className="absolute top-6 left-6 text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        ) : (
          <button 
            onClick={() => setStep(step - 1)} 
            className="absolute top-6 left-6 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}

        {/* Header */}
        <div className="text-center pt-4">
          <Calculator className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {step === 1 && "Reset Password"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "New Password"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 && "Enter your email to receive a reset code."}
            {step === 2 && (
              <>
                We sent a secure code to <span className="font-semibold text-gray-800">{email}</span>
              </>
            )}
            {step === 3 && "Almost there! Create your new password."}
          </p>
        </div>

        {/* ==================== STEP 1 FORM ==================== */}
        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border outline-none transition-colors"
                  placeholder="admin@smartpos.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 shadow-md"
            >
              {isSubmitting ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {/* ==================== STEP 2 FORM ==================== */}
        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label className="block text-sm font-medium text-gray-700">6-Digit OTP</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  maxLength="6"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border outline-none transition-colors tracking-widest font-mono text-lg"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Numbers only
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otp.length < 6}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 shadow-md"
            >
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        )}

        {/* ==================== STEP 3 FORM ==================== */}
        {step === 3 && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength="6"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border outline-none transition-colors"
                    placeholder="••••••••"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength="6"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border outline-none transition-colors"
                    placeholder="••••••••"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 shadow-md"
            >
              {isSubmitting ? "Resetting..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}