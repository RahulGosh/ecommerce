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
} from "../store/api/authApi";
import { useGetUserCartQuery } from "../store/api/cartApi";
import { CartResponse } from "../types/types";

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

  const { data: existingShippingDetails, isLoading, isError } =
    useGetShippingDetailsQuery(undefined);
  const { data: cartData, refetch: refetchCart } = useGetUserCartQuery();
  const { data: userOrder } = useGetUserOrderQuery(); // Fetching user order
  const [updateShippingDetail] = useUpdateShippingDetailMutation();
  const [placeOrder] = usePlaceOrderMutation();
  const [placeOrderWithStripe] = usePlaceOrderWithStripeMutation();

  useEffect(() => {
    if (isLoading) return;

    if (isError) {
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
  }, [existingShippingDetails, isLoading, isError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = () => {
    updateShippingDetail({ shippingId, ...shippingDetails });
    console.log("Shipping details updated successfully");
    setIsEditing(false);
  };
  console.log(userOrder, "userOrder")

  // Define the logic for each payment method
  const paymentMethods: Record<PaymentMethod, () => Promise<void>> = {
    cod: async () => {
      await placeOrder({ shippingId, method: "cod" });
      refetchCart()
      console.log("Order placed successfully with COD");
      navigate("/orders");
    },
    razorpay: async () => {
      console.log("Razorpay payment initiated");
    },
    stripe: async () => {
      if (!cartData) {
        console.error("No cart data available for Stripe payment.");
        return;
      }
      // Use the fetched orderId from userOrder for Stripe payment
      if (userOrder?.order) {
        const { data, error } = await placeOrderWithStripe();
        console.log(data, "data stripe");
        if (error) {
          console.error("Error placing order with Stripe:", error);
          return;
        }

        if (data && data.url) {
          // Redirect to Stripe's checkout page
          window.location.href = data.url;
        } else {
          console.error("Failed to create Stripe session.");
        }
      } else {
        console.error("Order ID not available.");
      }
    },
  };

  // Place order handler based on selected payment method
  const handlePlaceOrder = async () => {
    try {
      if (paymentMethods[method]) {
        await paymentMethods[method](); // Dynamically call the selected method
      } else {
        console.error("Invalid payment method selected");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        {/* Delivery Information Section */}
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        {/* Shipping Details */}
        <div className="mt-6">
          <pre>{JSON.stringify(existingShippingDetails?.shippingDetail, null, 2)}</pre>
          <button
            className="bg-black text-white px-4 py-2 mt-3 text-sm"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "CANCEL" : "EDIT"}
          </button>
        </div>

        {isEditing && (
          <>
          <div className="flex gap-3">
            <input
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              name="firstName"
              value={shippingDetails.firstName}
              onChange={handleInputChange}
              placeholder="First name"
            />
            <input
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              name="lastName"
              value={shippingDetails.lastName}
              onChange={handleInputChange}
              placeholder="Last name"
            />
          </div>
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="email"
            name="email"
            value={shippingDetails.email}
            onChange={handleInputChange}
            placeholder="Email address"
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="address"
            value={shippingDetails.address}
            onChange={handleInputChange}
            placeholder="Address"
          />
          <div className="flex gap-3">
            <input
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              name="city"
              value={shippingDetails.city}
              onChange={handleInputChange}
              placeholder="City"
            />
            <input
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              name="state"
              value={shippingDetails.state}
              onChange={handleInputChange}
              placeholder="State"
            />
          </div>
          <div className="flex gap-3">
            <input
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="number"
              name="pinCode"
              value={shippingDetails.pinCode}
              onChange={handleInputChange}
              placeholder="Pincode"
            />
            <input
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              name="country"
              value={shippingDetails.country}
              onChange={handleInputChange}
              placeholder="Country"
            />
          </div>
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            name="phoneNo"
            value={shippingDetails.phoneNo}
            onChange={handleInputChange}
            placeholder="Phone"
          />
          <button
            className="bg-black text-white px-4 py-2 mt-3 text-sm"
            onClick={handleSubmit}
          >
            SAVE
          </button>
        </>
        )}
      </div>
      {/* Payment Method */}
      <div className="mt-8">
      <CartTotal cart={cartData as CartResponse} />

        <div className="mt-12">
          
        <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border px-3 py-2 cursor-pointer"
            >
              <p
                className={`w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400" : ""}`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe" />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border px-3 py-2 cursor-pointer"
            >
              <p
                className={`w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-green-400" : ""}`}
              ></p>
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="Razorpay" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border px-3 py-2 cursor-pointer"
            >
              <p
                className={`w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`}
              ></p>
              <span className="mx-4 text-sm font-medium">Cash on Delivery</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            className="bg-black text-white px-6 py-3 text-sm w-full"
            onClick={handlePlaceOrder}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
