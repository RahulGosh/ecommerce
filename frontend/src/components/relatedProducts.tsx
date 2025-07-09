import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ProductCard from "./productCard";
import { useGetAllProductsQuery } from "../store/api/productApi";
import { Product } from "../types/types";
import { Link } from "react-router-dom";

interface RelatedProductsProps {
  category: string;
  subCategory: string;
  hoveredItem: string | null;
  setHoveredItem: (id: string | null) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  category,
  subCategory,
  hoveredItem,
  setHoveredItem,
}) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [related, setRelated] = useState<Product[]>([]);
  const { data: products, isLoading, isError } = useGetAllProductsQuery();

  useEffect(() => {
    if (products && products.products && products.products.length > 0) {
      const filteredProducts = products.products.filter(
        (item) => item.category === category && item.subCategory === subCategory
      );
      setRelated(filteredProducts.slice(0, 4)); // Show max 4 related products
    }
  }, [products, category, subCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center py-16 text-red-500">Error loading products.</div>;
  }

  return (
    <motion.section
      ref={ref}
      className="py-8 relative bg-gray-50"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Related Products
          </motion.h2>
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            You might also like these similar products
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {related.length > 0 ? (
            related.map((product) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                className="h-96"
              >
                <Link to={`/product/${product._id}`}>
                  <ProductCard
                    product={product}
                    isHovered={hoveredItem === product._id}
                    onMouseEnter={() => setHoveredItem(product._id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    showQuickView={true}
                    showColorOptions={true}
                    showCategory={false}
                  />
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center text-gray-500 py-8"
              variants={itemVariants}
            >
              No related products found.
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default RelatedProducts;