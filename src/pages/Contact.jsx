import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Thank you for contacting us! We’ll get back soon.");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(data.message || "❌ Failed to send message.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white text-gray-800">
        <Toaster position="top-center" />
<SEO
  title="Contact Suswastik Spices – Get in Touch Today"
  description="Have questions? Contact Suswastik Spices for queries about products, wholesale orders, partnerships, or support. We're here to assist you with authentic Indian spice solutions."
  keywords="contact suswastik, suswastik spices contact, spice enquiry, indian spices support, wholesale spices india"
  canonical="https://suswastik.com/contact-us"
  robots="index, follow"
  author="Suswastik Team"
  publisher="Suswastik"
/>

        {/* Header Section */}
        <motion.section
          className="relative text-white text-center py-20 px-6 shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          style={{
            backgroundImage: "url('/images/about-poster.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <motion.div
            className="absolute inset-0 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          ></motion.div>

          <motion.div
            className="relative z-10 max-w-3xl mx-auto text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-block bg-black/30 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Contact Us
              </h1>
              <p className="text-lg md:text-xl text-gray-100">
                We’d love to hear from you!
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Content Section */}
        <section className="px-6 md:px-16 py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

          {/* Left Section */}
          <motion.div
            className="flex flex-col justify-center space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-[#BB4D00]">
              Get in Touch
            </h2>

            <div className="space-y-5 text-gray-700">
              <ContactItem
                icon={<FaMapMarkerAlt className="text-[#BB4D00]" />}
                label="Address"
                text="P.No.8, S.No.5, Naina Vihar, Rampura Road, Sanganer, Jaipur-302029"
              />
              <ContactItem
                icon={<FaPhoneAlt className="text-[#BB4D00]" />}
                label="Phone"
                text="+91 9414446467 , 9414545230"
              />
              <ContactItem
                icon={<FaEnvelope className="text-[#BB4D00]" />}
                label="Email"
                text="Suswastikspices@gmail.com"
              />
            </div>

            {/* Social Icons */}
          <div className="mt-8">
  <h3 className="text-2xl font-semibold text-[#BB4D00] mb-4">
    Follow Us
  </h3>

  <div className="flex items-center space-x-4">
    <Link
      to="https://www.instagram.com/_suswastik/?igsh=Mmh3czBpbWE5dDU1&utm_source=qr#"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex"
    >
      <SocialIcon Icon={FaInstagram} link="https://www.instagram.com/_suswastik/" />
    </Link>
  </div>
</div>

          </motion.div>

          {/* Right Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-3xl shadow-xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-semibold text-[#BB4D00] mb-8">
              Send a Message
            </h3>

            <div className="space-y-5">
              <FormField label="Your Name" name="name" value={form.name} onChange={handleChange} type="text" required />
              <FormField label="Email" name="email" value={form.email} onChange={handleChange} type="email" required />
              <FormField label="Contact Number" name="phone" value={form.phone} onChange={handleChange} type="tel" required />

              <div>
                <label className="block mb-2 text-gray-700">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full border rounded-xl px-4 py-3 text-gray-700"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-lg text-white ${
                  loading ? "bg-gray-400" : "bg-[#BB4D00] hover:bg-[#9b3d00]"
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </motion.form>
        </section>
      </div>
    </>
  );
}

/* --- Form Field Component --- */
function FormField({ label, name, type, value, onChange, ...props }) {
  return (
    <div>
      <label className="block mb-2 text-gray-700 font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
        className="w-full border rounded-xl px-4 py-3 text-gray-700"
      />
    </div>
  );
}

/* --- Contact Info Item --- */
function ContactItem({ icon, label, text }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="p-2 bg-orange-100 rounded-full">{icon}</div>
      <div>
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-gray-600 text-[15px]">{text}</p>
      </div>
    </div>
  );
}

/* --- Social Icons --- */
function SocialIcon({ Icon, link }) {
  return (
    <Link
      to={link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#BB4D00] text-white p-3 rounded-full hover:bg-[#a03f00] transition"
    >
      <Icon size={20} />
    </Link>
  );
}
