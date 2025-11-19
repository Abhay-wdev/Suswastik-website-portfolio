import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSubscriberStore } from "../store/subscriberStore";

const SuswastikPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [formData, setFormData] = useState({ email: "", phone: "" });
  const [message, setMessage] = useState("");
  const [removed, setRemoved] = useState(false);

  const { addSubscriber, loading } = useSubscriberStore();

  // Detect client-side mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Show popup after 1s only if not shown recently (within 3 min)
  useEffect(() => {
    if (!hasMounted) return;

    const lastShown = localStorage.getItem("popupLastShown");
    const now = Date.now();
    const threeMinutes = 3 * 60 * 1000; // 180,000 ms

    if (!lastShown || now - Number(lastShown) > threeMinutes) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        localStorage.setItem("popupLastShown", now.toString());
      }, 1000); // show after 1 second

      return () => clearTimeout(timer);
    }
  }, [hasMounted]);

  // Don't render if not needed
  if (!hasMounted || removed || !showPopup) return null;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleClose = () => {
    setShowPopup(false);
    setTimeout(() => setRemoved(true), 700);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { email, phone } = formData;
    if (!email || !phone) {
      toast.error("Please fill all fields");
      return;
    }

    await addSubscriber(email, phone);
    setFormData({ email: "", phone: "" });
    setMessage("✅ Thank you for signing up!");
    toast.success("Thank you for joining Suswastik!");

    setTimeout(() => handleClose(), 1000);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 font-[Poppins] p-4 transition-opacity duration-300 ${
        showPopup ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg overflow-hidden border-2 border-[#FF6900]
        transform transition-all duration-300 hover:scale-[1.02] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close popup"
          className="absolute top-3 right-3 bg-[#FF6900] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#e64a00] transition"
        >
          &times;
        </button>

        {/* Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-[#FF6900] to-red-600"></div>

        {/* Content */}
        <div className="p-6 sm:p-8 text-center overflow-y-auto max-h-[90vh]">
          {/* Logo */}
          <div className="flex flex-col items-center mb-4">
            <img
              src="/images/logo.webp"
              alt="Suswastik logo"
              className="h-12 sm:h-14 mb-2"
            />
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              The Spice of Authenticity
            </span>
          </div>

          {/* Heading */}
          <div className="mb-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FF6900] mb-2">
              Welcome to Suswastik Spices
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Join our family to get{" "}
              <span className="font-semibold text-red-600">
                exclusive recipes
              </span>
              , festive offers & tasty updates straight to your inbox!
            </p>
          </div>

          {/* Image */}
          <div className="mb-6">
            <img
              src="/images/poaster.webp"
              alt="Spices poster"
              className="w-full rounded-lg shadow-md object-cover max-h-48 sm:max-h-64 mx-auto"
            />
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 text-left sm:text-center"
          >
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6900] text-sm sm:text-base"
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6900] text-sm sm:text-base"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#FF6900] hover:bg-[#e64a00] text-white py-3 rounded-lg font-semibold transition duration-300 shadow-md ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Submitting..." : "Join Now"}
            </button>
          </form>

          {message && (
            <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuswastikPopup;