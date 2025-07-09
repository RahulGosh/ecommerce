import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import CartTotal from "../components/cartTotal";
import Title from "../components/title";
import { useNavigate } from "react-router-dom";
import {
  useUpdateShippingDetailMutation,
  useGetShippingDetailsQuery,
  usePlaceOrderMutation,
  usePlaceOrderWithStripeMutation,
  useGetUserOrderQuery,
  useCreateShippingDetailMutation,
} from "../store/api/authApi";
import { useGetUserCartQuery } from "../store/api/cartApi";
import { CartResponse, User } from "../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Loader2, ChevronRight, Edit, Plus } from "lucide-react";

const PlaceOrder = () => {
  type PaymentMethod = "cod" | "razorpay" | "stripe";

  const [method, setMethod] = useState<PaymentMethod>("cod");
  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pinCode: 0,
    country: "",
    phoneNo: 0,
  });
  const [shippingId, setShippingId] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const {
    data: existingShippingDetails,
    isLoading: isLoadingShipping,
    isError: isShippingError,
    refetch
  } = useGetShippingDetailsQuery(undefined);

  const { data: cartData, refetch: refetchCart } = useGetUserCartQuery();
  const { data: userOrder } = useGetUserOrderQuery();

  const [updateShippingDetail, { isLoading: isUpdatingShipping }] = useUpdateShippingDetailMutation();
  const [createShippingDetail, { isLoading: isCreatingShipping }] = useCreateShippingDetailMutation();
  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();
  const [placeOrderWithStripe, { isLoading: isProcessingStripe }] = usePlaceOrderWithStripeMutation();

  const isProcessingPayment = isPlacingOrder || isProcessingStripe;
  const isProcessingShipping = isUpdatingShipping || isCreatingShipping;

  useEffect(() => {
    if (isLoadingShipping) return;

    // Only set shipping details if they exist
    if (existingShippingDetails?.shippingDetail) {
      const detail = existingShippingDetails.shippingDetail;

      setShippingId(detail._id || "");
      setShippingDetails({
        firstName: detail.firstName || "",
        lastName: detail.lastName || "",
        email: detail.email || "",
        address: detail.address || "",
        city: detail.city || "",
        state: detail.state || "",
        pinCode: detail.pinCode || 0,
        country: detail.country || "",
        phoneNo: detail.phoneNo || 0,
      });
    }
  }, [existingShippingDetails, isLoadingShipping]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (shippingId) {
        await updateShippingDetail({ shippingId, ...shippingDetails }).unwrap();
        refetch();
        console.log("Shipping details updated successfully");
      } else {
        const result = await createShippingDetail({
          userId: user?.profile?._id ?? "",
          shippingDetail: {
            ...shippingDetails,
            userId: user?.profile?._id ?? "",
          },
        }).unwrap();

        if (result?.shippingDetail?._id) {
          setShippingId(result.shippingDetail._id);
        }
        refetch();
        console.log("Shipping details added successfully");
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error handling shipping details:", error);
    }
  };

  const paymentMethods: Record<PaymentMethod, () => Promise<void>> = {
    cod: async () => {
      await placeOrder({ shippingId, method: "cod" }).unwrap();
      await refetchCart();
      navigate("/orders");
    },
    razorpay: async () => {
      console.log("Razorpay payment initiated");
    },
    stripe: async () => {
      if (!cartData) {
        throw new Error("No cart data available for Stripe payment.");
      }

      if (!userOrder?.order) {
        throw new Error("Order ID not available.");
      }

      const result = await placeOrderWithStripe().unwrap();
      
      if (result?.url) {
        window.location.href = result.url;
      } else {
        throw new Error("Failed to create Stripe session.");
      }
    },
  };

  const handlePlaceOrder = async () => {
    try {
      if (paymentMethods[method]) {
        await paymentMethods[method]();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  if (isLoadingShipping) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Determine if we should show the shipping form
  // We show the form if: 
  // 1. User has no shipping details (isShippingError is true)
  // 2. User is editing their shipping details
  // 3. We have no existing shipping details
  const showShippingForm = isShippingError || isEditing || !existingShippingDetails?.shippingDetail;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Shipping Information */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Delivery Information</h2>
              {existingShippingDetails?.shippingDetail && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
              )}
            </div>

            {/* Show either shipping details or form */}
            {!showShippingForm && existingShippingDetails?.shippingDetail ? (
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {existingShippingDetails.shippingDetail.firstName}{" "}
                      {existingShippingDetails.shippingDetail.lastName}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {existingShippingDetails.shippingDetail.address}
                    </p>
                    <p className="text-gray-600">
                      {existingShippingDetails.shippingDetail.city},{" "}
                      {existingShippingDetails.shippingDetail.state}{" "}
                      {existingShippingDetails.shippingDetail.pinCode}
                    </p>
                    <p className="text-gray-600">
                      {existingShippingDetails.shippingDetail.country}
                    </p>
                    <p className="text-gray-600 mt-2">
                      Phone: {existingShippingDetails.shippingDetail.phoneNo}
                    </p>
                    <p className="text-gray-600">
                      Email: {existingShippingDetails.shippingDetail.email}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Show form for creating/editing shipping details
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      type="text"
                      name="firstName"
                      value={shippingDetails.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      type="text"
                      name="lastName"
                      value={shippingDetails.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="email"
                    name="email"
                    value={shippingDetails.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    id="address"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="text"
                    name="address"
                    value={shippingDetails.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      type="text"
                      name="city"
                      value={shippingDetails.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      id="state"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      type="text"
                      name="state"
                      value={shippingDetails.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP/Postal Code
                    </label>
                    <input
                      id="pinCode"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      type="number"
                      name="pinCode"
                      value={shippingDetails.pinCode || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      id="country"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      type="text"
                      name="country"
                      value={shippingDetails.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phoneNo"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      type="tel"
                      name="phoneNo"
                      value={shippingDetails.phoneNo || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  {existingShippingDetails?.shippingDetail && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isProcessingShipping}
                  >
                    {isProcessingShipping && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isProcessingShipping ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
            
            <div className="space-y-4">
              <div
                onClick={() => !isProcessingPayment && setMethod("stripe")}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                  method === "stripe" ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-gray-400"
                } ${isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 border rounded-full mr-3 flex items-center justify-center ${
                    method === "stripe" ? "border-indigo-500 bg-indigo-500" : "border-gray-300"
                  }`}>
                    {method === "stripe" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <img className="h-6" src={assets.stripe_logo} alt="Stripe" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div
                onClick={() => !isProcessingPayment && setMethod("razorpay")}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                  method === "razorpay" ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-gray-400"
                } ${isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 border rounded-full mr-3 flex items-center justify-center ${
                    method === "razorpay" ? "border-indigo-500 bg-indigo-500" : "border-gray-300"
                  }`}>
                    {method === "razorpay" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <img className="h-6" src={assets.razorpay_logo} alt="Razorpay" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div
                onClick={() => !isProcessingPayment && setMethod("cod")}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                  method === "cod" ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-gray-400"
                } ${isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 border rounded-full mr-3 flex items-center justify-center ${
                    method === "cod" ? "border-indigo-500 bg-indigo-500" : "border-gray-300"
                  }`}>
                    {method === "cod" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className="text-gray-700 font-medium">Cash on Delivery</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <CartTotal cart={cartData as CartResponse} />

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessingPayment || (!shippingId && !isProcessingShipping)}
              className="w-full mt-6 px-6 py-3 bg-indigo-600 border border-transparent rounded-md text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingPayment && <Loader2 className="w-5 h-5 animate-spin" />}
              {isProcessingPayment ? "Processing..." : "Place Order"}
            </button>

            {!shippingId && !isProcessingShipping && (
              <div className="mt-4 text-sm text-red-600">
                {showShippingForm 
                  ? "Please save your shipping information before placing the order." 
                  : "Please add or confirm your shipping information before placing the order."}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Need help?</h3>
              <p className="text-sm text-gray-500">
                Contact our customer support at support@example.com or call +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;