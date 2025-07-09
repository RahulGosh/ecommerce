import React, { useState } from "react";
import { FiHeart, FiStar } from "react-icons/fi";
import { Product } from "../../types/types";

interface CollectionProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

const CollectionProductCard: React.FC<CollectionProductCardProps> = ({ product, viewMode }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (viewMode === "grid") {
    return (
      <div className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
        {/* Status Badge */}
        {product.price < 50 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-medium px-2 py-1 rounded-md z-10">
            SALE
          </div>
        )}

        {/* Wishlist button */}
        <button 
          className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-sm bg-white bg-opacity-60 transition-all duration-200 z-10 ${isWishlisted ? 'text-red-500' : 'text-gray-600'}`}
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image */}
        <div className="relative h-56 md:h-64 overflow-hidden">
          <img
            src={product.images[0]?.imageUrl || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-medium text-xs px-4 py-2 rounded-md transition-colors">
              QUICK VIEW
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex flex-col">
            <div className="flex items-center mb-1">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar 
                    key={star} 
                    className={`w-3 h-3 ${star <= 4 ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">(24)</span>
            </div>
            
            <h3 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h3>
            <p className="text-xs text-gray-500 capitalize mb-2">{product.category}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-600 border border-gray-200"></div>
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <div className="w-3 h-3 rounded-full bg-gray-800"></div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                {product.price && (
                  <p className="text-xs text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col sm:flex-row">
      <div className="relative w-full sm:w-48 h-48">
        <img
          src={product.images[0]?.imageUrl || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.price < 50 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-medium px-2 py-1 rounded-md z-10">
            SALE
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-base font-medium text-gray-900">{product.name}</h3>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</p>
              {product.price && (
                <p className="text-xs text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</p>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 capitalize mb-2">{product.category} | {product.subCategory}</p>
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar 
                  key={star} 
                  className={`w-3 h-3 ${star <= 4 ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">(24)</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-full bg-blue-600 border border-gray-200"></div>
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <div className="w-4 h-4 rounded-full bg-gray-800"></div>
          </div>
          
          <button 
            className={`p-1.5 rounded-full ${isWishlisted ? 'text-red-500' : 'text-gray-600'}`}
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionProductCard;