import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProductCard from '../productCard';
import { useGetAllProductsQuery } from '../../store/api/productApi';
import { Link } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  hoveredItem: string | null;
  setHoveredItem: Dispatch<SetStateAction<string | null>>;
}

const BestSellerSection: React.FC<Props> = ({ hoveredItem, setHoveredItem }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const { data: allProducts, isLoading, error } = useGetAllProductsQuery();

  // Filter products to show only best sellers
  const bestSellerProducts = allProducts?.products?.filter(product => 
    product.bestSeller === true
  ) || [];

  // Limit to showing only the first 4 best sellers
  const products = bestSellerProducts.slice(0, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.section 
      ref={ref}
      className="py-16 relative bg-gray-50"
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
            Best Sellers
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Our most loved products - tried, tested, and adored by customers
          </motion.p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load best sellers</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {products.map((product) => (
              <motion.div 
                key={product._id}
                variants={itemVariants}
                className="h-96 relative"
              >
                {product.bestSeller && (
                  <div className="absolute top-2 left-2 z-10 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    Best Seller
                  </div>
                )}
                <Link to={`/product/${product?._id}`}>
                  <ProductCard
                    product={product}
                    isHovered={hoveredItem === product._id}
                    onMouseEnter={() => setHoveredItem(product._id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    showQuickView={true}
                    showColorOptions={true}
                    showCategory={true}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default BestSellerSection;