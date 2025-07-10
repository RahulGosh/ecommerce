import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types/types';

export interface ProductCardProps {
  product: Product;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  showQuickView?: boolean;
  showColorOptions?: boolean;
  showCategory?: boolean;
  showAddToCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  // showQuickView = true,
  showColorOptions = true,
  showCategory = true,
  showAddToCart = true,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = product?.images?.length > 1;
  console.log(product?.images, "product?.images")
  useEffect(() => {
    if (!hasMultipleImages || !isHovered) {
      setCurrentImageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % product?.images?.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, hasMultipleImages, product?.images?.length]);

  return (
    <motion.div 
      className="group relative bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-shadow w-full h-full flex flex-col"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -5 }}
    >
      {product?.bestSeller && (
        <div className="absolute top-4 left-4 z-10 px-2 py-1 text-xs font-bold rounded-full bg-amber-500 text-white">
          BESTSELLER
        </div>
      )}
      
      <motion.div 
        className="w-full h-full overflow-hidden bg-gray-100 relative"
        initial={{ scale: 1 }}
        whileHover={{ scale: 0.98 }}
      >
        <div className="relative w-full h-full overflow-hidden">
          {product?.images?.map((image, index) => (
            <motion.img
              key={image.publicId || index}
              src={image?.imageUrl}
              alt={product?.name}
              className={`absolute object-cover object-center w-full h-full transition duration-500 ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: index === currentImageIndex ? 1 : 0,
                zIndex: index === currentImageIndex ? 10 : 0
              }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>
        
        {hasMultipleImages && (
          <div className="absolute bottom-4 right-4 flex space-x-1 z-20">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {showColorOptions && (
          <motion.div 
            className="absolute bottom-4 left-4 flex space-x-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10
            }}
            transition={{ duration: 0.3 }}
          >
            {/* You can add color options here if needed */}
          </motion.div>
        )}
        
        <motion.button 
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : -10
          }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </motion.button>
      </motion.div>
      
      <div className="p-4 flex flex-col">
        <div className="mb-2">
          <h3 className="font-medium text-gray-900 text-sm truncate">{product?.name}</h3>
          {showCategory && product?.category && (
            <p className="mt-1 text-xs text-gray-500">{product?.category}</p>
          )}
          <p className="text-sm font-bold text-indigo-600 mt-1">${product?.price}</p>
        </div>
        
        {showAddToCart && (
          <motion.button 
            className="w-full bg-gray-100 hover:bg-indigo-600 hover:text-white text-gray-800 text-xs py-2 rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add to Cart
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;