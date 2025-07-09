import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import RelatedProducts from "../components/relatedProducts";
import { assets } from "../assets/assets";
import { SearchContext } from "../context/searchContext";
import { useGetSingleProductQuery } from "../store/api/productApi";
import { useAddToCartMutation } from "../store/api/cartApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useAddToRecentlyViewedMutation } from "../store/api/authApi";

const Product: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const productId = params.productId || "";
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const { user } = useSelector((store: RootState) => store.auth);

  const [
    addToCart,
    {
      data: addToCartData,
      isSuccess: addToCartSuccess,
      isLoading: isAddingToCart,
    },
  ] = useAddToCartMutation();

  const [addToRecentlyViewed] = useAddToRecentlyViewedMutation();

  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("SearchContext is not provided");
  }

  const {
    data: productData,
    isLoading,
    isSuccess,
  } = useGetSingleProductQuery(productId, { skip: !productId });

  const [image, setImage] = useState<string>("");
  const [size, setSize] = useState<string>("");

  useEffect(() => {
    const trackRecentlyViewed = async () => {
      if (productData?.product && user) {
        try {
          await addToRecentlyViewed({ productId }).unwrap();
          console.log("Added to recently viewed");
        } catch (error) {
          console.error("Failed to add to recently viewed:", error);
        }
      }
    };

    trackRecentlyViewed();
  }, [productData, productId, user, addToRecentlyViewed]);

  useEffect(() => {
    if (productData?.product) {
      setImage(productData.product.images[0]?.imageUrl || "");
    }

    if (addToCartSuccess) {
      toast.success(addToCartData?.message);
    }
  }, [productData, addToCartSuccess, addToCartData]);

  const handleAddToCart = async (productId: string, size: string) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!size) {
      toast.warning("Please select a size");
      return;
    }

    await addToCart({ productId, size });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  // Animation variants
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

  // Available sizes
  const allSizes = ["S", "M", "L", "XL", "XXL"];

  // Check if a size is available in the product's size array
  const availableSizes = productData?.product.sizes || [];

  return isSuccess && productData ? (
    <motion.div
      ref={ref}
      className="pt-10 max-w-7xl mx-auto px-6 bg-white"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="flex gap-8 lg:gap-12 flex-col lg:flex-row">
        <motion.div
          className="flex-1 flex flex-col-reverse gap-4 sm:flex-row"
          variants={itemVariants}
        >
          {/* Thumbnails */}
          <div className="flex flex-row sm:flex-col overflow-x-auto sm:overflow-y-auto sm:w-20 lg:w-24">
            {productData.product.images.map((item, index) => (
              <motion.img
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setImage(item.imageUrl)}
                src={item.imageUrl}
                alt={`Thumbnail ${index + 1}`}
                key={item.publicId}
                className={`w-20 h-20 sm:w-full sm:h-auto object-cover mb-3 cursor-pointer rounded-md shadow-sm`}
              />
            ))}
          </div>

          {/* Main Image */}
          <motion.div
            className="w-full sm:w-[85%] rounded-lg overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              className="w-full h-auto object-contain rounded-lg shadow-md"
              src={image}
              alt={productData.product.name}
            />
          </motion.div>
        </motion.div>

        <motion.div className="flex-1" variants={containerVariants}>
          <motion.span
            variants={itemVariants}
            className="inline-block px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-medium mb-3"
          >
            {productData.product.category} / {productData.product.subCategory}
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="font-bold text-3xl mb-2 text-gray-800"
          >
            {productData.product.name}
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-1 mb-4"
          >
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <img
                  key={star}
                  src={star <= 4 ? assets.star_icon : assets.star_dull_icon}
                  alt={`${star <= 4 ? "Star" : "Star dull"}`}
                  className="w-4 h-4"
                />
              ))}
            </div>
            <p className="pl-2 text-gray-500 text-sm">(122 reviews)</p>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-3xl font-bold mb-6 text-sky-600"
          >
            ${productData.product.price}
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-gray-600 lg:w-5/6 mb-8 leading-relaxed"
          >
            {productData.product.description}
          </motion.p>

          <motion.div variants={containerVariants} className="mb-8">
            <motion.p
              variants={itemVariants}
              className="font-medium mb-3 text-gray-800"
            >
              Select Size
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-3">
              {allSizes.map((item) => (
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSize(item)}
                  key={item}
                  className={`w-12 h-12 flex items-center justify-center rounded-full transition-all border text-sm font-medium
                    ${
                      item === size
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }
                    ${
                      availableSizes.includes(item)
                        ? "cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }
                  `}
                  disabled={!availableSizes.includes(item)}
                >
                  {item}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAddToCart(productId, size)}
              className={`bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg flex-1 font-medium shadow-md transition-all ${
                isAddingToCart ? "opacity-70 cursor-wait" : ""
              }`}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <span className="inline-block mr-2 animate-spin">⟳</span>
                  Adding...
                </>
              ) : (
                "Add To Cart"
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="border-2 border-coral-500 text-coral-500 px-4 rounded-lg hover:bg-coral-50"
            >
              ♥
            </motion.button>
          </motion.div>

          <motion.hr variants={itemVariants} className="my-8" />

          <motion.div
            variants={containerVariants}
            className="text-sm text-gray-500 mb-4 space-y-2"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <span className="text-sky-500">✓</span>
              <p>100% Original Product</p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <span className="text-sky-500">✓</span>
              <p>Cash on delivery available</p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <span className="text-sky-500">✓</span>
              <p>Easy 7-day return and exchange policy</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div variants={containerVariants} className="mt-20">
        <motion.div variants={itemVariants} className="flex border-b">
          <button className="px-6 py-4 text-sm font-medium border-b-2 border-sky-600 text-sky-600">
            Description
          </button>
          <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
            Reviews (122)
          </button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="py-6 text-gray-600 leading-relaxed space-y-4"
        >
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur
            minus eum voluptate, accusamus dignissimos incidunt corrupti
            asperiores sed expedita maxime ipsum eaque iste, aliquid tempora
            explicabo numquam, hic dolore quo!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            iure deserunt natus aspernatur voluptas alias explicabo nesciunt,
            enim atque saepe.
          </p>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="py-12">
        <RelatedProducts
          category={productData.product.category}
          subCategory={productData.product.subCategory}
          hoveredItem={hoveredItem}
          setHoveredItem={setHoveredItem}
        />
      </motion.div>
    </motion.div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
