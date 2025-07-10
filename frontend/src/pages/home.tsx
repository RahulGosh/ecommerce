import { motion } from "framer-motion";
import { useState } from "react";
import Hero from "../components/hero";
import BrandMarquee from "../components/home/brandMarquee";
import ProductsSection from "../components/home/productsSection";
import StatsSection from "../components/statSection";
import CategoriesSection from "../components/home/categoriesSection";
import TestimonialsSection from "../components/home/testimonialSection";
import NewsletterSection from "../components/newsletterBox";
import RecentlyViewed from "../components/recentlyViewed";
import BestSellerSection from "../components/home/bestSeller";
// import { User } from "../types/types";
// import { useSelector } from "react-redux";
// import { RootState } from "../store/store";
import { useLoadUserQuery } from "../store/api/authApi"; // Import your API hook

const Home = () => {
  // const { user } = useSelector((store: RootState) => store.auth) as {
  //   user: User | null;
  // };
  
  // Fetch user data including recently viewed items
  const { data: userData } = useLoadUserQuery();
  
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Check if user has recently viewed items
  // const hasRecentlyViewed = userData?.recentlyViewed && userData.recentlyViewed.length > 0;

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Colorful Background Elements */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-amber-200 to-pink-300 mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-sky-300 to-indigo-400 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-emerald-200 to-teal-300 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </motion.div>

      <Hero />
      <BrandMarquee />
      <CategoriesSection />
      <StatsSection />
      <BestSellerSection
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
      />
      <ProductsSection
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
      />
      {userData  && <RecentlyViewed />}
      <TestimonialsSection /> 
      <NewsletterSection />
    </div>
  );
};

export default Home;