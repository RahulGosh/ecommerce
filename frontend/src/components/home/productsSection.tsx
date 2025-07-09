import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProductCard from '../productCard';
import { useLatestCollectionQuery } from '../../store/api/productApi';
import { Link, useNavigate } from 'react-router-dom';

interface Props {
  hoveredItem: string | null;
  setHoveredItem: (id: string | null) => void;
}

const ProductsSection: React.FC<Props> = ({ hoveredItem, setHoveredItem }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const { data: latestProducts, isLoading, error } = useLatestCollectionQuery();
  const navigate = useNavigate()

  const products = latestProducts?.products || [];

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
      className="py-16 relative"
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
            Featured Products
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Discover our handpicked selection of this season's must-have items.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {products.map((product) => (
            <motion.div 
              key={product._id}
              variants={itemVariants}
              className="h-96"
            >
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
        
        <motion.div 
          className="text-center mt-12"
          variants={itemVariants}
        >
          <motion.button 
            className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/collection")}
          >
            View All Products
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProductsSection;