import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/UserStore";

export default function SignupForm() {
  const navigate = useNavigate();

  const {
    step,
    message,
    loading,
    sendOtp,
    verifyOtp,
    goToStep,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({
    name: "",
    password: "",
    phone: "",
  });

  /* =====================================================
     🧠 FORM HANDLERS
  ===================================================== */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* =====================================================
     📨 SEND OTP
  ===================================================== */
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      return;
    }

    await sendOtp(email);
  };

  /* =====================================================
     ✅ VERIFY OTP & REGISTER
  ===================================================== */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length < 4) return;
    if (form.password.length < 4) return;
    if (!form.name.trim()) return;
    if (!form.phone.trim()) return;

    const payload = {
      email,
      otp,
      ...form,
    };

    await verifyOtp(payload, navigate);
  };

  /* =====================================================
     🧱 UI
  ===================================================== */
  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-gray-200 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-semibold text-center text-[#BB4D00] mb-2">
        Create Account
      </h2>

      <p className="text-center text-gray-500 mb-4">
        {step === 1
          ? "Enter your email to receive an OTP"
          : "Verify OTP & complete registration"}
      </p>

      {/* ================= MESSAGE BOX ================= */}
      {message && (
        <div
          className={`mb-5 p-3 rounded-md text-sm text-center font-medium
          ${
            message.toLowerCase().includes("success") ||
            message.toLowerCase().includes("otp") ||
            message.toLowerCase().includes("verified")
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md
                focus:ring-2 focus:ring-[#BB4D00] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BB4D00] text-white py-2 rounded-md
              hover:bg-[#a04400] transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 4-digit OTP"
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md
                focus:ring-2 focus:ring-[#BB4D00] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="Your Full Name"
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md
                focus:ring-2 focus:ring-[#BB4D00] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleFormChange}
              placeholder="Min 4 characters"
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md
                focus:ring-2 focus:ring-[#BB4D00] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleFormChange}
              placeholder="Enter phone number"
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md
                focus:ring-2 focus:ring-[#BB4D00] outline-none"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="w-1/3 border border-[#BB4D00] text-[#BB4D00] py-2 rounded-md
                hover:bg-[#fff4ee]"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-2/3 bg-[#BB4D00] text-white py-2 rounded-md
                hover:bg-[#a04400]"
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
