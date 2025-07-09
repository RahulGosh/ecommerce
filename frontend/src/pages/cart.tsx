import React, { useEffect, useState } from "react";
import { useGetUserCartQuery, useUpdateCartMutation, useRemoveCartMutation } from "../store/api/cartApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { User } from "../types/types";
import Loader from "../utils/loader";
import { motion } from "framer-motion";
import { 
  FiMinus, 
  FiPlus, 
  FiTrash2, 
  FiArrowRight, 
  FiShoppingBag, 
  FiArrowLeft,
  FiHeart,
  FiX,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { RiCouponLine } from "react-icons/ri";
import { BsBoxSeam } from "react-icons/bs";

const CartComponent: React.FC = () => {
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const { data: cartData, isLoading, refetch } = useGetUserCartQuery();
  const [updateCart, { isError: updateError, isSuccess: updateSuccess }] = useUpdateCartMutation();
  const [removeCart, { 
    data: removeCartData, 
    isLoading: isRemovingGlobal, 
    isError: removeError, 
    isSuccess: removeSuccess 
  }] = useRemoveCartMutation();

  const { user } = useSelector((store: RootState) => store.auth) as {
    user: User | null;
  };

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeCartData?.message || "Item removed successfully");
      setIsRemoving(null);
    }

    if (updateSuccess) {
      toast.success("Cart updated successfully");
    }

    if (updateError) {
      toast.error("Failed to update cart");
    }

    if (removeError) {
      toast.error("Failed to remove item");
      setIsRemoving(null);
    }
  }, [updateSuccess, updateError, removeSuccess, removeError, removeCartData?.message]);

  const items = cartData?.cart?.items || [];
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  // const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // const shippingFee = 5.00;
  // const taxRate = 0.07;
  // const taxAmount = subtotal * taxRate;
  // const discountAmount = couponApplied ? subtotal * 0.1 : 0; // 10% discount for demo
  // const orderTotal = subtotal + shippingFee + taxAmount - discountAmount;

  const handleUpdateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) return;
    updateCart({ productId, size, quantity });
  };

  const handleRemoveItem = (productId: string, size: string) => {
    setIsRemoving(`${productId}-${size}`);
    removeCart({ productId, size });
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    
    // Simulate coupon validation
    if (couponCode.toLowerCase() === "save10") {
      setCouponApplied(true);
      setCouponError("");
      toast.success("Coupon applied successfully!");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const toggleProductDetails = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-16 px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FiShoppingBag className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added any items to your cart yet.
        </p>
        <button 
          onClick={() => navigate("/collection")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <span>Continue Shopping</span>
          <FiArrowRight className="ml-2" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="mt-8">
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              {items.map((item, index) => {
                const product = item.product;
                const productImage = product?.images?.[0]?.imageUrl || "";
                const itemKey = `${item._id}-${item.size}-${index}`;
                const isRemovingThis = isRemoving === `${item.product._id}-${item.size}`;
                const isExpanded = expandedProduct === item.product._id;
                
                return (
                  <motion.li 
                    key={itemKey}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="py-6 flex flex-col sm:flex-row"
                  >
                    <div className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 border rounded-md overflow-hidden relative">
                      <img
                        src={productImage}
                        alt={product?.name || "Product Image"}
                        className="w-full h-full object-cover object-center"
                      />
                      <button 
                        className="absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm bg-white bg-opacity-60 transition-all duration-200 z-10 text-gray-600 hover:text-red-500"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <FiHeart className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 ml-0 sm:ml-6 mt-4 sm:mt-0 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            {product?.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Size: <span className="font-medium">{item.size}</span>
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Price: <span className="font-medium">${item.price.toFixed(2)}</span>
                          </p>
                          <button
                            onClick={() => toggleProductDetails(item.product._id)}
                            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                          >
                            {isExpanded ? (
                              <>
                                <span>Hide details</span>
                                <FiChevronUp className="ml-1 h-4 w-4" />
                              </>
                            ) : (
                              <>
                                <span>Show details</span>
                                <FiChevronDown className="ml-1 h-4 w-4" />
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-base font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* {isExpanded && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500">Color:</p>
                              <p className="font-medium capitalize">{product?.color || "Black"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Material:</p>
                              <p className="font-medium capitalize">{product?.material || "Cotton"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">SKU:</p>
                              <p className="font-medium">{product?.sku || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Availability:</p>
                              <p className="font-medium text-green-600">In Stock</p>
                            </div>
                          </div>
                        </div>
                      )} */}

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.product._id, item.size, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={`p-2 ${item.quantity <= 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-50'}`}
                          >
                            <FiMinus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-1 text-center w-12">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.product._id, item.size, item.quantity + 1)}
                            className="p-2 text-gray-600 hover:bg-gray-50"
                          >
                            <FiPlus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.product._id, item.size)}
                          disabled={isRemovingThis}
                          className="flex items-center text-gray-500 hover:text-red-500 transition-colors duration-200"
                        >
                          {isRemovingThis ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <FiTrash2 className="h-4 w-4" />
                              <span className="ml-1 text-sm">Remove</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-10 sm:mt-16">
          <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">${cartData?.itemsPrice}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Shipping estimate</p>
                <p className="text-sm font-medium text-gray-900">${cartData?.shippingPrice}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Tax estimate</p>
                <p className="text-sm font-medium text-gray-900">${cartData?.taxPrice}</p>
              </div>

              {/* Coupon Section */}
              <div className="pt-2">
                {!showCouponInput ? (
                  <button 
                    onClick={() => setShowCouponInput(true)}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    <RiCouponLine className="mr-1 h-4 w-4" />
                    {couponApplied ? "Coupon applied" : "Have a coupon code?"}
                  </button>
                ) : (
                  <div className="mt-2">
                    <div className="flex">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <button
                        onClick={couponApplied ? removeCoupon : applyCoupon}
                        className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {couponApplied ? "Remove" : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="mt-1 text-sm text-red-600">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {couponApplied && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                  <div className="flex items-center text-sm text-green-600">
                    <RiCouponLine className="mr-1 h-4 w-4" />
                    <span>Discount (10%)</span>
                  </div>
                  <p className="text-sm font-medium text-green-600">-${cartData?.totalPrice}</p>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <p className="text-base font-medium text-gray-900">Order total</p>
                <p className="text-base font-medium text-gray-900">
                  ${cartData?.cart?.totalPrice}
                </p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={() => navigate("/place-order")}
                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center justify-center"
              >
                Proceed to Checkout
                <FiArrowRight className="ml-2 h-4 w-4" />
              </button>
              
              <button
                type="button"
                onClick={() => navigate("/collection")}
                className="w-full bg-white border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center transition-colors"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </button>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center text-sm text-gray-500">
              <div className="flex items-center">
                <IoShieldCheckmarkOutline className="mr-1 h-4 w-4 text-gray-400" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center">
                <BsBoxSeam className="mr-1 h-4 w-4 text-gray-400" />
                <span>Free returns within 30 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartComponent;