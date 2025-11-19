import React from "react";

import Blog from "../components/Blog";
import CategorySection from "../components/CategorySection";
import FoodVideoGallery from "../components/FoodVideoGallery";
import ProductsPage from "../components/ProductsPage";

import SEO from "../components/SEO"; // 🟢 Make sure this path is correct

export default function Products() {
  return (
    <>
      {/* ⭐ Dynamic SEO for Products Listing Page */}
      <SEO
        title="Suswastik Spices – Explore Premium Indian Spices & Products"
        description="Browse a wide range of premium, pure, and authentic Indian spices at Suswastik. Fresh, aromatic, traditionally processed, and perfect for everyday cooking."
        keywords="suswastik spices, indian spices, organic spices, buy spices online, premium spices, masala powder, herbal spices, spice products"
        canonical="https://suswastik.com/products"
        robots="index, follow"
        author="Suswastik Team"
        publisher="Suswastik"
      />

      {/* ⭐ Page UI */}
      <ProductsPage />
      <CategorySection />
      <FoodVideoGallery />
      <Blog />
    </>
  );
}
