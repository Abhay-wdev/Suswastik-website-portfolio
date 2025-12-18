import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaKey, FaLock, FaArrowRight } from "react-icons/fa";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* =====================================================
     📨 SEND OTP
  ===================================================== */
  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setMessage(data.message || "OTP sent successfully");
        setStep(2);
      } else {
        setMessage(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     🔐 RESET PASSWORD
  ===================================================== */
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword) {
      setMessage("Please fill in all fields");
      return;
    }

    if (newPassword.length < 4) {
      setMessage("Password must be at least 4 characters");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setMessage("Password reset successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "Invalid OTP or request");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error while resetting password");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     🧱 UI
  ===================================================== */
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-amber-200">
        <h2 className="text-2xl font-bold text-amber-800 mb-2 text-center">
          {step === 1 ? "Forgot Password" : "Reset Your Password"}
        </h2>

        <p className="text-amber-600 text-center mb-4">
          {step === 1
            ? "Enter your email to receive an OTP"
            : "Enter the OTP and your new password"}
        </p>

        {/* ================= MESSAGE BOX ================= */}
        {message && (
          <div
            className={`mb-5 p-3 rounded-md text-sm text-center font-medium
            ${
              message.toLowerCase().includes("success") ||
              message.toLowerCase().includes("otp") ||
              message.toLowerCase().includes("redirect")
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={step === 1 ? handleSendOTP : handleResetPassword}
          className="space-y-5"
        >
          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-amber-500" />
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border border-amber-300 rounded-lg
                  focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                  bg-white text-gray-700 placeholder-amber-400 transition"
              />
            </div>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <>
              <div className="relative">
                <FaKey className="absolute left-3 top-3 text-amber-500" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 border border-amber-300 rounded-lg
                    focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                    bg-white text-gray-700 placeholder-amber-400 transition"
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-amber-500" />
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 border border-amber-300 rounded-lg
                    focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                    bg-white text-gray-700 placeholder-amber-400 transition"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700
              text-white py-3 rounded-lg font-semibold
              hover:from-amber-700 hover:to-amber-800
              transition-all duration-300 transform hover:scale-[1.02]
              active:scale-[0.98] shadow-md flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 
                      0 5.373 0 12h4zm2 
                      5.291A7.962 7.962 0 014 12H0c0 
                      3.042 1.135 5.824 3 
                      7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : step === 1 ? (
              <>
                Send OTP <FaArrowRight className="ml-2" />
              </>
            ) : (
              <>
                Reset Password <FaArrowRight className="ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/signup")}
            className="text-amber-700 font-semibold hover:text-amber-800 transition"
          >
            Back to Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
