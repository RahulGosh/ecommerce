import { motion } from "framer-motion";
import Title from "./title";
import ProductItem from "./productItem";
import { useLatestCollectionQuery } from "../store/api/productApi";

const LatestCollection = () => {
  const { data: latestProducts, isLoading, error } = useLatestCollectionQuery();

  // Ensure that `products` is typed as an array and filter latest products
  const products = Array.isArray(latestProducts?.products) ? latestProducts?.products : [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Decorative elements */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={titleVariants}
          className="text-center mb-12"
        >
          <Title text1={"LATEST"} text2={"COLLECTION"} />
          <p className="max-w-2xl mx-auto mt-4 text-sm sm:text-base text-neutral-dark">
            Discover our latest collection of premium products curated just for you!
          </p>
          
          <motion.div 
            className="w-16 h-1 bg-accent rounded-full mx-auto mt-6"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.div>

        {/* Products grid with loading, error and empty states */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 rounded-full border-4 border-neutral-light border-t-primary animate-spin"></div>
            <p className="mt-4 text-neutral-dark font-medium">Loading latest collection...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 rounded-xl">
            <svg className="w-12 h-12 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="mt-3 text-red-600 font-medium">Failed to load products</p>
            <button className="mt-4 px-6 py-2 bg-white text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              Try Again
            </button>
          </div>
        ) : products && products.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {products.map((item, index) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                whileHover="hover"
                custom={index}
              >
                <ProductItem
                  id={item._id}
                  image={item.images?.[0]?.imageUrl || '/default-image.jpg'}
                  name={item.name}
                  price={item.price}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-neutral-light/20 rounded-xl">
            <svg className="w-12 h-12 mx-auto text-neutral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-3 text-neutral-dark font-medium">No products found in our latest collection</p>
            <p className="mt-2 text-neutral text-sm">Please check back soon for new arrivals</p>
          </div>
        )}

        {/* View more button displayed only when there are products */}
        {products && products.length > 0 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <button className="px-8 py-3 border-2 border-primary text-primary font-medium rounded-full hover:bg-primary hover:text-white transition-colors group">
              View More
              <svg className="inline-block ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default LatestCollection;