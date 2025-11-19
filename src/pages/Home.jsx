import React from "react";

// ⭐ Import components like normal React (NOT Next.js)
import HeroSection from "../components/HeroSection";
import SubCategorySection from "../components/SubCategorySection";
 
import HandmadeSection from "../components/HandmadeSection";
import ReviewSection from "../components/ReviewSection";
import Blog from "../components/Blog";
import UspRibbonSection from "../components/UspRibbonSection";
import FoodVideoGallery from "../components/FoodVideoGallery";
import CategorySection from "../components/CategorySection";
import ComparisonSection from "../components/ComparisonSection";
import SuswastikB2B from "../components/SuswastikB2B";
import SuswastikPopup from "../components/SuswastikPopup";
import ProductsPage from "../components/ProductsPage";
import SEO from "../components/SEO";

const Home = () => {
  return (
    <>
<SEO
  title="Suswastik – Premium Organic & Handmade Products"
  description="Discover eco-friendly and handmade organic products crafted with purity."
  keywords="suswastik, organic, handmade, eco friendly"
  canonical="https://suswastik.com/"
  robots="index, follow"
  author="Suswastik Team"
  publisher="Suswastik"
/>
<h1 class="sr-only">Suswastik – Pure, Authentic & Handcrafted Indian Spices</h1>

      <SubCategorySection />
      <HeroSection />
      <UspRibbonSection />
      <HandmadeSection />
      <FoodVideoGallery />
      <CategorySection />
       <ProductsPage/>
      <ComparisonSection />
      <SuswastikB2B />
      <ReviewSection />
      <SuswastikPopup />
      <Blog />
    </>
  );
};

export default Home;
