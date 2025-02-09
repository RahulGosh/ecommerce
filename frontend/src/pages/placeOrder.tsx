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
import { Loader2 } from "lucide-react";

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

    if (isShippingError) {
      console.error("Error fetching shipping details");
      return;
    }

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
  }, [existingShippingDetails, isLoadingShipping, isShippingError]);

  const { user } = useSelector((store: RootState) => store.auth) as {
    user: User | null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user?.profile?._id) {
      console.error("User ID is missing. Cannot create shipping details.");
      return;
    }
    
    try {
      if (shippingId) {
        await updateShippingDetail({ shippingId, ...shippingDetails }).unwrap();
        console.log("Shipping details updated successfully");
      } else {
        const result = await createShippingDetail({
          userId: user?.profile?._id,
          shippingDetail: {
            ...shippingDetails,
            userId: user?.profile?._id,
          },
        }).unwrap();

        if (result?.shippingDetail?._id) {
          setShippingId(result.shippingDetail._id);
        }
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

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>
        
        <div className="mt-6">
          {isShippingError ? (
            <div className="text-red-500">Error loading shipping details. Please try again.</div>
          ) : (
            <>
              {existingShippingDetails?.shippingDetail && !isEditing && (
                <div className="border p-4 rounded">
                  <p className="font-medium">
                    {existingShippingDetails.shippingDetail.firstName}{" "}
                    {existingShippingDetails.shippingDetail.lastName}
                  </p>
                  <p>{existingShippingDetails.shippingDetail.address}</p>
                  <p>
                    {existingShippingDetails.shippingDetail.city},{" "}
                    {existingShippingDetails.shippingDetail.state}{" "}
                    {existingShippingDetails.shippingDetail.pinCode}
                  </p>
                  <p>{existingShippingDetails.shippingDetail.country}</p>
                  <p>Phone: {existingShippingDetails.shippingDetail.phoneNo}</p>
                </div>
              )}
              <button
                className="bg-black text-white px-4 py-2 mt-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setIsEditing((prev) => !prev)}
                disabled={isProcessingShipping}
              >
                {existingShippingDetails?.shippingDetail ? "EDIT" : "ADD"}
              </button>
            </>
          )}
        </div>

        {isEditing && (
          <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="flex gap-3">
              <input
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                name="firstName"
                value={shippingDetails.firstName}
                onChange={handleInputChange}
                placeholder="First name"
                required
              />
              <input
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                name="lastName"
                value={shippingDetails.lastName}
                onChange={handleInputChange}
                placeholder="Last name"
                required
              />
            </div>
            <input
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="email"
              name="email"
              value={shippingDetails.email}
              onChange={handleInputChange}
              placeholder="Email address"
              required
            />
            <input
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              name="address"
              value={shippingDetails.address}
              onChange={handleInputChange}
              placeholder="Address"
              required
            />
            <div className="flex gap-3">
              <input
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                name="city"
                value={shippingDetails.city}
                onChange={handleInputChange}
                placeholder="City"
                required
              />
              <input
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                name="state"
                value={shippingDetails.state}
                onChange={handleInputChange}
                placeholder="State"
                required
              />
            </div>
            <div className="flex gap-3">
              <input
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="number"
                name="pinCode"
                value={shippingDetails.pinCode || ""}
                onChange={handleInputChange}
                placeholder="Pincode"
                required
              />
              <input
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                name="country"
                value={shippingDetails.country}
                onChange={handleInputChange}
                placeholder="Country"
                required
              />
            </div>
            <input
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="tel"
              name="phoneNo"
              value={shippingDetails.phoneNo || ""}
              onChange={handleInputChange}
              placeholder="Phone"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 mt-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessingShipping}
            >
              {isProcessingShipping && <Loader2 className="w-4 h-4 animate-spin" />}
              {isProcessingShipping ? "SAVING..." : "SAVE"}
            </button>
          </form>
        )}
      </div>

      <div className="mt-8">
        <CartTotal cart={cartData as CartResponse} />

        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => !isProcessingPayment && setMethod("stripe")}
              className={`flex items-center gap-3 border px-3 py-2 cursor-pointer ${
                isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className={`w-3.5 h-3.5 border rounded-full ${
                method === "stripe" ? "bg-green-400" : ""
              }`} />
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe" />
            </div>
            <div
              onClick={() => !isProcessingPayment && setMethod("razorpay")}
              className={`flex items-center gap-3 border px-3 py-2 cursor-pointer ${
                isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className={`w-3.5 h-3.5 border rounded-full ${
                method === "razorpay" ? "bg-green-400" : ""
              }`} />
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="Razorpay" />
            </div>
            <div
              onClick={() => !isProcessingPayment && setMethod("cod")}
              className={`flex items-center gap-3 border px-3 py-2 cursor-pointer ${
                isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className={`w-3.5 h-3.5 border rounded-full ${
                method === "cod" ? "bg-green-400" : ""
              }`} />
              <span className="mx-4 text-sm font-medium">Cash on Delivery</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            className="bg-black text-white px-6 py-3 text-sm w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePlaceOrder}
            disabled={isProcessingPayment || !shippingId}
          >
            {isProcessingPayment && <Loader2 className="w-4 h-4 animate-spin" />}
            {isProcessingPayment ? "PROCESSING..." : "PLACE ORDER"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;