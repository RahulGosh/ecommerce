import React, { useEffect } from "react";
import { useGetUserCartQuery, useUpdateCartMutation, useRemoveCartMutation } from "../store/api/cartApi";
import { assets } from "../assets/assets";
import Title from "../components/title";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import CartTotal from "../components/cartTotal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../utils/loader";

const CartComponent: React.FC = () => {
  const navigate = useNavigate();

  const { data: cartData, isLoading } = useGetUserCartQuery();
  const [updateCart, { isError: updateError, isSuccess: updateSuccess }] = useUpdateCartMutation();
  const [removeCart, { data: removeCartData, isLoading: isRemoving, isError: removeError, isSuccess: removeSuccess }] = useRemoveCartMutation();

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeCartData?.message || "Cart Removed successfully!");
    }

    if (updateError) {
      toast.error("Failed to update cart.");
    }

    if (removeError) {
      toast.error("Failed to remove item from cart.");
    }
  }, [updateSuccess, updateError, removeSuccess, removeError]);

  const items = cartData?.cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <p>Your cart is empty.</p>
      </div>
    );
  }

  // Handle updating item quantity
  const handleUpdateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) return; // Prevent setting quantity to zero or negative
    updateCart({ productId, size, quantity });
  };

  // Handle removing an item from the cart
  const handleRemoveItem = (productId: string, size: string) => {
    removeCart({ productId, size });
  };

  return (
    <div className="border-t pt-14">
      {isLoading && <Loader /> }
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <ul>
        {items.map((item, index) => {
          const product = item.product;
          const productImage = product?.images?.[0]?.imageUrl || ""; // Fallback image if not found
          return (
            <div
              key={`${item._id}-${item.size}-${index}`}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_0.5fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  src={productImage}
                  alt={product?.name || "Product Image"}
                  className="w-16 sm:w-20"
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">{product?.name}</p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>${item.price}</p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FaMinus
                  onClick={() =>
                    handleUpdateQuantity(item.product._id, item.size, item.quantity - 1)
                  }
                  className="cursor-pointer"
                />
                <p className="text-sm">{item.quantity}</p>
                <FaPlus
                  onClick={() =>
                    handleUpdateQuantity(item.product._id, item.size, item.quantity + 1)
                  }
                  className="cursor-pointer"
                />
              </div>
              <div className="relative">
                {/* Show loading spinner when removing item */}
                {isRemoving && (
                  <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75">
                    <div className="loader-small"></div> {/* Small loader */}
                  </div>
                )}
                <img
                  onClick={() => handleRemoveItem(item.product._id, item.size)}
                  className="w-4 mr-4 sm:w-5 cursor-pointer"
                  src={assets.bin_icon}
                  alt="Remove item"
                />
              </div>
            </div>
          );
        })}
      </ul>

      {items.length === 0 && (
        <div className="text-center py-10">
          <p>Your cart is empty</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="flex justify-end my-20">
          <div className="w-full sm:w-[450px]">
            <CartTotal cart={cartData} />
            <div className="w-full text-end">
              <button
                onClick={() => navigate("/place-order")}
                className="bg-black text-white text-sm my-8 px-8 py-3"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartComponent;
