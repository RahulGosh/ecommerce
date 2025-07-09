import React, { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "../types/types";
import ProductCard from "./productCard";
import { useGetRecentlyViewedQuery } from "../store/api/authApi";
import { Link } from "react-router-dom";

interface RecentlyViewedProps {
  recentItems?: Product[];
  onItemClick?: (item: Product) => void;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  recentItems = [],
  onItemClick,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { data, isLoading, isError } = useGetRecentlyViewedQuery();

  // Default items matching Product type
  const defaultItems: Product[] = [
    {
      _id: "1",
      name: "Classic White Tee",
      description: "Comfortable cotton t-shirt",
      price: 29.99,
      images: [
        {
          publicId: "classic-white-tee",
          imageUrl:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        },
      ],
      category: "T-Shirts",
      subCategory: "Basic",
      sizes: ["S", "M", "L"],
      bestSeller: true,
      date: new Date().toISOString(),
    },
    {
      _id: "2",
      name: "Leather Jacket",
      description: "Premium leather jacket",
      price: 199.99,
      images: [
        {
          publicId: "leather-jacket",
          imageUrl:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        },
      ],
      category: "Jackets",
      subCategory: "Leather",
      sizes: ["M", "L", "XL"],
      bestSeller: false,
      date: new Date().toISOString(),
    },
  ];

  const productsToShow = data?.recentlyViewed?.length ? data.recentlyViewed : defaultItems;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <motion.h2
            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            Recently Viewed
          </motion.h2>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            View All
          </button>
        </div>

        <div className="relative">
          {/* Scrollable container */}
          <div className="flex space-x-4 pb-4 overflow-x-auto scrollbar-hide">
            {productsToShow?.map((product) => (
              <motion.div
                key={product._id}
                className="flex-shrink-0 w-64 h-72" // Fixed width and height for each card
                whileHover={{ y: -5 }}
                onClick={() => onItemClick?.(product)}
              >
                <Link to={`/product/${product?._id}`}>
                  <ProductCard
                    product={product}
                    isHovered={hoveredItem === product._id}
                    onMouseEnter={() => setHoveredItem(product._id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    showQuickView={false}
                    showColorOptions={false}
                    showCategory={false}
                    showAddToCart={false}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Gradient fade effect at the edges */}
          <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;