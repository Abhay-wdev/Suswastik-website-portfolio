import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/UserStore";
import {
  FaUser,
  FaLock,
  FaExclamationTriangle,
  FaArrowRight,
} from "react-icons/fa";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  /* =====================================================
     HANDLE INPUT CHANGE
  ===================================================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
    if (message) setMessage("");
  };

  /* =====================================================
     HANDLE FORGOT PASSWORD
  ===================================================== */
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  /* =====================================================
     HANDLE SUBMIT
  ===================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---------- Validation ----------
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (form.password.length < 4) {
      setError("Password must be at least 4 characters long");
      return;
    }

    setError("");
    setMessage("");

    // ---------- Attempt login ----------
    const result = await login(form, navigate);

    if (!result?.success) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (result?.message === "Invalid username or password") {
        setError(
          newAttempts === 1
            ? "Invalid username or password"
            : "Multiple failed attempts. Please try again or reset your password."
        );
      } else {
        setError(result?.message || "Invalid username or password");
      }
    } else {
      setAttempts(0);
      setMessage(result?.message || "Login successful");
    }
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="max-w-md mx-auto mt-16 p-1">
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-xl p-8 border border-amber-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-700 mb-4">
            <FaUser className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-amber-800">Welcome Back</h2>
          <p className="text-amber-600 mt-2">Sign in to your account</p>
        </div>

        {/* ================= MESSAGE BOX ================= */}
        {message && (
          <div className="mb-4 flex items-center bg-green-100 text-green-700 p-3 rounded-lg border border-green-300">
            <FaArrowRight className="mr-2 flex-shrink-0" />
            <span className="text-sm">{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center bg-red-50 text-red-700 p-3 rounded-lg border border-red-200">
            <FaExclamationTriangle className="mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-amber-500" />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-3 border border-amber-300 rounded-lg
                  focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                  bg-white text-gray-700 placeholder-amber-400 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-amber-500" />
              </div>
              <input
                name="password"
                type="password"
                placeholder="Password (min 4 characters)"
                value={form.password}
                onChange={handleChange}
                required
                minLength={4}
                className="w-full pl-10 pr-3 py-3 border border-amber-300 rounded-lg
                  focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                  bg-white text-gray-700 placeholder-amber-400 transition"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700
              text-white py-3 rounded-lg font-medium
              hover:from-amber-700 hover:to-amber-800
              transition-all duration-300 transform hover:scale-[1.02]
              active:scale-[0.98] shadow-md flex items-center justify-center"
          >
            {loading ? (
              <>
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
                Logging in...
              </>
            ) : (
              <>
                Login <FaArrowRight className="ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Forgot Password Section */}
        {attempts >= 2 && (
          <div className="mt-6 p-4 bg-amber-100 border border-amber-300 rounded-lg">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-amber-800 font-medium">
                  Having trouble signing in?
                </p>
                <p className="text-amber-700 text-sm mt-1">
                  You've attempted login multiple times.
                </p>
                <button
                  onClick={handleForgotPassword}
                  className="mt-3 w-full bg-gradient-to-r from-amber-500 to-amber-600
                    text-white py-2 px-4 rounded-lg font-medium
                    hover:from-amber-600 hover:to-amber-700 transition-all
                    flex items-center justify-center"
                >
                  Reset your password
                  <FaArrowRight className="ml-2 text-sm" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sign Up */}
        <div className="mt-8 pt-6 border-t border-amber-200 text-center">
          <span className="text-amber-700">Don&apos;t have an account? </span>
          <Link
            to="/signup"
            className="inline-flex items-center text-amber-700
              hover:text-amber-800 font-semibold transition"
          >
            Sign Up <FaArrowRight className="ml-1 text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
}
