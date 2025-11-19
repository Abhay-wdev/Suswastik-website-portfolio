import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/UserStore";
import toast from "react-hot-toast";

export default function SignupForm() {
  const navigate = useNavigate();
  const { step, message, loading, sendOtp, verifyOtp, goToStep } = useAuthStore();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({
    name: "",
    password: "",
    phone: "",
  });

  // 🔔 Auto-toast when message updates
  useEffect(() => {
    if (!message) return;
    const lowerMsg = message.toLowerCase();

    if (
      lowerMsg.includes("success") ||
      lowerMsg.includes("otp sent") ||
      lowerMsg.includes("registered") ||
      lowerMsg.includes("verified")
    ) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }, [message]);

  // 🧠 Handle input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 📨 Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      await sendOtp(email);
    } catch (err) {
      const backendMsg = err?.response?.data?.message;
      toast.error(backendMsg || "Failed to send OTP. Please try again.");
    }
  };

  // ✅ Verify OTP & Register
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid 4-digit OTP.");
      return;
    }

    if (form.password.length < 4) {
      toast.error("Password must be at least 4 characters long.");
      return;
    }

    if (!form.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    const data = { email, otp, ...form };

    try {
      await verifyOtp(data, navigate);
    } catch (err) {
      const backendMsg = err?.response?.data?.message;
      toast.error(backendMsg || "Verification failed. Please try again.");
    }
  };

  // 🧱 UI
  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-gray-200 rounded-2xl shadow-lg relative">
      <h2 className="text-3xl font-semibold text-center text-[#BB4D00] mb-2">
        Create Account
      </h2>
      <p className="text-center text-gray-500 mb-6">
        {step === 1
          ? "Enter your email to receive an OTP"
          : "Verify OTP & complete registration"}
      </p>

      {/* STEP 1: Email Input */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-[#BB4D00] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BB4D00] text-white font-medium py-2 rounded-md hover:bg-[#a04400] transition duration-200"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* STEP 2: OTP + Registration Fields */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">OTP</label>
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-[#BB4D00] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="Your Full Name"
              value={form.name}
              onChange={handleFormChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-[#BB4D00] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Create a Password (min 4 characters)"
              value={form.password}
              onChange={handleFormChange}
              required
              minLength={4}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-[#BB4D00] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              type="text"
              placeholder="Enter Phone Number"
              value={form.phone}
              onChange={handleFormChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-[#BB4D00] outline-none"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-between gap-3 mt-4">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="w-1/3 border border-[#BB4D00] text-[#BB4D00] py-2 rounded-md hover:bg-[#fff4ee] transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 bg-[#BB4D00] text-white py-2 rounded-md hover:bg-[#a04400] transition"
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}