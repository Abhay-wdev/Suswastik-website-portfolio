"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Leaf,
  ShieldCheck,
  Users,
  Sparkles,
  Quote,
  Check,
  ChevronDown,
  Factory,
  HandHeart,
  Sprout,
  Flame,
} from "lucide-react";

export default function About() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    show: { transition: { staggerChildren: 0.18 } },
  };

  // FAQ toggle state
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (i) => {
    setOpenFAQ(openFAQ === i ? null : i);
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen font-sans">

      {/* ====================== HERO ========================= */}
      <section className="relative bg-gradient-to-r from-[#BB4D00] to-[#ff7a1a] text-white py-20 text-center px-6 overflow-hidden">

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-5xl md:text-6xl font-extrabold drop-shadow-xl"
        >
          About Us
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl max-w-3xl mx-auto mt-4"
        >
          We preserve the wisdom of our grandmothers and blend it with the purity of nature — giving families the nourishment they deserve.
        </motion.p>

        <motion.img
          src="/about-hero.png"
          alt="hero"
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto mt-10 rounded-xl shadow-2xl"
        />
      </section>

      {/* ====================== VALUES GRID ========================= */}
      <section className="max-w-7xl mx-auto py-14 px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6"
        >
          {[
            { icon: HandHeart, title: "Traditional Wisdom", text: "Recipes inspired by age-old Ayurvedic nourishment practices." },
            { icon: Sprout, title: "Natural Nutrition", text: "Pure ingredients that energize and strengthen the body naturally." },
            { icon: ShieldCheck, title: "Quality First", text: "Every batch is tested, verified and made under strict hygiene standards." },
            { icon: Users, title: "Family-Focused", text: "Health solutions crafted for kids, mothers, adults & elders." },
          ].map((i, idx) => (
            <motion.div key={idx} variants={fadeUp}
              className="p-6 bg-white border rounded-xl shadow-md hover:shadow-xl transition text-center">
              <i.icon className="w-12 h-12 text-[#BB4D00] mx-auto mb-4" />
              <h3 className="text-lg font-semibold">{i.title}</h3>
              <p className="text-sm mt-2 text-gray-600">{i.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ====================== BRAND STORY ========================= */}
      <section className="py-12 px-6 md:px-20 max-w-6xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-4xl font-bold text-[#BB4D00] mb-6"
        >
          Our Story: From Kitchen Tradition to Family Wellness
        </motion.h2>

        <motion.p variants={fadeUp} initial="hidden" whileInView="show" className="text-lg mb-6">
          What began as a grandmother’s lovingly-made laddus for her family slowly turned into a mission to make **authentic, nutritious and traditional foods** accessible to every household in India.
        </motion.p>

        <motion.p variants={fadeUp} initial="hidden" whileInView="show" transition={{ delay: 0.2 }} className="text-lg mb-6">
          We believe that real health doesn’t come from artificial supplements but from **nature, balance, and pure ingredients**. Every recipe has been refined over the years — yet its soul remains rooted in simplicity and purity.
        </motion.p>

        <motion.p variants={fadeUp} initial="hidden" whileInView="show" transition={{ delay: 0.4 }} className="text-lg mb-8">
          Today, our products nourish **new mothers, growing children, fitness lovers, and elders** alike — because good nutrition has no age limit.
        </motion.p>
      </section>

      {/* ====================== FOUNDER SECTION ========================= */}
      <section className="bg-[#FFF4EB] py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl font-bold text-[#BB4D00] mb-4">Meet Our Founder</h2>
            <p className="text-lg text-gray-700">
              Inspired by her grandmother’s recipes and deep-rooted belief in natural nourishment,
              our founder began crafting laddus for new mothers and relatives.  
              The overwhelming results pushed her to create a brand that keeps tradition alive while ensuring modern hygiene and consistency.
            </p>
            <p className="text-lg mt-4 text-gray-700">
              Her mission is simple:  
              <strong className="text-[#BB4D00]">to bring honest, healthy, natural food to every home.</strong>
            </p>
          </motion.div>

          <motion.img
            src="/founder.jpg"
            alt="founder"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* ====================== INGREDIENT QUALITY ========================= */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-3xl font-bold text-[#BB4D00] mb-8"
        >
          What Makes Our Ingredients Special?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Handpicked Nuts & Seeds",
            "Cold-Pressed Ghee",
            "Chemical-Free Ingredients",
            "Premium Dry Fruits",
            "Sun-Dried Herbs",
            "Ayurvedic Superfoods",
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              className="p-5 bg-white rounded-xl border shadow-sm flex items-center gap-3"
            >
              <Check className="w-6 h-6 text-[#BB4D00]" />
              <p className="font-medium text-gray-700">{item}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====================== MANUFACTURING PROCESS ========================= */}
      <section className="bg-[#FFF2E8] py-20 px-6">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-4xl font-bold text-[#BB4D00] text-center mb-12"
        >
          How We Make Our Products
        </motion.h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-10 text-center">
          {[
            { icon: Leaf, title: "Ingredient Selection" },
            { icon: Factory, title: "Roasting & Blending" },
            { icon: Flame, title: "Slow Heat Cooking" },
            { icon: Heart, title: "Hand-Rolled Perfection" },
          ].map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              className="p-6 bg-white rounded-xl shadow-md"
            >
              <step.icon className="w-14 h-14 text-[#BB4D00] mx-auto mb-4" />
              <h3 className="font-semibold text-lg">{step.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====================== FAQ ========================= */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-[#BB4D00] mb-8">Frequently Asked Questions</h2>

        {[
          { q: "Are your laddus safe for kids?", a: "Absolutely! We use natural ingredients with no preservatives." },
          { q: "Do you add sugar?", a: "Only natural sweeteners like jaggery and dates are used." },
          { q: "Are these good for postpartum?", a: "Yes — we specialize in postpartum healing mixes and laddus." },
          { q: "Do you ship pan-India?", a: "Yes, we deliver to all states with secure packaging." },
        ].map((item, i) => (
          <div key={i} className="border-b py-4 cursor-pointer" onClick={() => toggleFAQ(i)}>
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium">{item.q}</p>
              <ChevronDown className={`w-6 h-6 transition ${openFAQ === i ? "rotate-180" : ""}`} />
            </div>

            <motion.div
              initial={{ height: 0 }}
              animate={{ height: openFAQ === i ? "auto" : 0 }}
              className="overflow-hidden"
            >
              <p className="text-gray-600 mt-3 pr-4">{item.a}</p>
            </motion.div>
          </div>
        ))}
      </section>

      {/* ====================== CTA ========================= */}
      <section className="bg-[#BB4D00] text-white py-20 text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-4xl font-extrabold mb-4"
        >
          Your Health Journey Starts with Real, Honest Food
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          transition={{ delay: 0.2 }}
          className="text-lg max-w-2xl mx-auto opacity-90"
        >
          Explore our handmade laddus, wellness mixes and natural superfoods crafted for every generation.
        </motion.p>

        <motion.a
          href="/products"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          transition={{ delay: 0.4 }}
          className="inline-block bg-white text-[#BB4D00] mt-8 px-10 py-3 text-lg rounded-full font-bold shadow-md hover:bg-gray-100 transition"
        >
          Shop Now
        </motion.a>
      </section>
    </div>
  );
}
