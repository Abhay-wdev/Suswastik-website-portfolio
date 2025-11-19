import React from "react";
import { motion } from "framer-motion";
import {
  FaLeaf,
  FaHandsHelping,
  FaAward,
  FaHeart,
  FaSeedling,
  FaUsers,
} from "react-icons/fa";
import SEO from "../components/SEO";
export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white text-gray-800">
 <SEO
        title="About Us – Suswastik Spices | Tradition • Purity • Authentic Taste"
        description="Learn about Suswastik Spices — a brand built on purity, tradition, and authentic Indian flavors. Discover our mission, vision, farmer partnerships, and what makes us unique."
        keywords="about suswastik spices, suswastik story, indian spices brand, pure spices, organic spices, premium spice company"
        canonical="https://suswastik.com/about-us"
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
          backgroundImage: "url('/images/poster-aboit.webp')",
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
        >
          <div className="inline-block bg-black/30 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              About Us
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-100">
              At <strong>Suswastik Spices</strong>, we bring the authentic taste
              of India — blending tradition, purity & passion in every spice.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Our Story */}
      <motion.section
        className="max-w-6xl mx-auto px-6 md:px-16 py-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[#BB4D00] mb-6 text-center">
          Our Story
        </h2>

        <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
          Suswastik Spices began as a family vision and grew into a trusted
          household name. Every spice carries our commitment to purity,
          tradition & premium quality.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto mt-6">
          From farms to your kitchen — we ensure freshness, aroma & authentic
          flavors in every batch.
        </p>
      </motion.section>

      {/* Vision & Mission */}
      <motion.section
        className="bg-white py-20 border-t border-orange-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-16 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl font-bold text-[#BB4D00] mb-4">Our Vision</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              To be a globally recognized spice brand known for purity, quality
              and sustainable values.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#BB4D00] mb-4">Our Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              To offer authentic, natural & high-quality spices while empowering
              farmers and preserving tradition.
            </p>
          </div>

        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        className="py-20 px-6 md:px-16 bg-gradient-to-b from-orange-100 to-white"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[#BB4D00] mb-12 text-center">
          Why Choose Suswastik Spices?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          <FeatureCard
            icon={<FaLeaf size={30} />}
            title="100% Natural & Pure"
            desc="No artificial colors or preservatives — only pure spices."
          />

          <FeatureCard
            icon={<FaAward size={30} />}
            title="Premium Quality"
            desc="Every batch is aroma-checked, quality-tested & freshness guaranteed."
          />

          <FeatureCard
            icon={<FaHandsHelping size={30} />}
            title="Supporting Farmers"
            desc="Direct partnerships with local farmers ensure fairness & sustainability."
          />

          <FeatureCard
            icon={<FaSeedling size={30} />}
            title="Eco-Friendly"
            desc="We adopt eco-friendly packaging & environmental responsibility."
          />

          <FeatureCard
            icon={<FaHeart size={30} />}
            title="Made with Passion"
            desc="Our spice blends are crafted with love & authentic Indian flavor."
          />

          <FeatureCard
            icon={<FaUsers size={30} />}
            title="Trusted by Families"
            desc="Generations trust Suswastik Spices for purity and tradition."
          />

        </div>
      </motion.section>

    </div>
  );
}

/* --- Reusable Feature Card Component --- */
function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all text-center border border-orange-100"
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-[#BB4D00] mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );
}
