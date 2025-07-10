import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetOrderBySessionIdQuery } from "../store/api/productApi";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get("session_id");
  const [showConfetti, setShowConfetti] = useState(true);

  // Handle missing session_id
  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }
    
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [sessionId, navigate]);

  const { data, isLoading, isError } = useGetOrderBySessionIdQuery(
    sessionId || "",
    {
      skip: !sessionId,
    }
  );

  useEffect(() => {
    if (data) {
      console.log("Order data:", data);
    }
  }, [data]);

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Session ID Missing</h1>
          <p className="text-red-500 mb-6">
            We couldn't find your order session. Please check your order history.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Your Orders
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Loading order details...</h1>
          <p className="text-gray-500">Just a moment while we fetch your order information</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Error Loading Order</h1>
          <p className="text-gray-600 mb-6">
            There was a problem fetching your order. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-yellow-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find an order associated with this session.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Confetti effect component
  const Confetti = () => {
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              backgroundColor: ['#FFC107', '#E91E63', '#3F51B5', '#4CAF50'][Math.floor(Math.random() * 4)],
              borderRadius: '50%',
              animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get estimated delivery date (5-7 days from order date)
  const getEstimatedDelivery = () => {
    if (!data?.order?.createdAt) return "Unknown";
    const orderDate = new Date(data.order.createdAt);
    const minDelivery = new Date(orderDate);
    minDelivery.setDate(minDelivery.getDate() + 5);
    const maxDelivery = new Date(orderDate);
    maxDelivery.setDate(maxDelivery.getDate() + 7);
    
    const minDay = minDelivery.getDate();
    const maxDay = maxDelivery.getDate();
    const minMonth = minDelivery.toLocaleString('default', { month: 'short' });
    const maxMonth = maxDelivery.toLocaleString('default', { month: 'short' });
    
    if (minMonth === maxMonth) {
      return `${minDay} - ${maxDay} ${minMonth}`;
    }
    return `${minDay} ${minMonth} - ${maxDay} ${maxMonth}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {showConfetti && <Confetti />}
      
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header banner */}
          <div className="bg-gradient-to-r from-green-500 to-teal-500 py-8 px-8 text-center text-white">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-white rounded-full shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Thank You For Your Order!</h1>
            <p className="text-lg opacity-90">Your order has been confirmed and will be shipping soon</p>
          </div>
          
          {/* Order info */}
          <div className="p-8">
            {/* Order header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                <p className="text-gray-500">Order #{data.order._id.slice(-8).toUpperCase()}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  data.order.paymentStatus === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    data.order.paymentStatus === "completed" ? "bg-green-500" : "bg-yellow-500"
                  }`}></span>
                  {data.order.paymentStatus === "completed" ? "Payment Completed" : data.order.paymentStatus}
                </span>
              </div>
            </div>
            
            {/* Order meta info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-500 mb-2">Order Date</h3>
                <p className="font-medium text-gray-800">
                  {data.order.createdAt ? formatDate(data.order.createdAt) : "Not available"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-500 mb-2">Total Amount</h3>
                <p className="font-medium text-gray-800 text-lg">₹{data.order.totalPrice.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-500 mb-2">Estimated Delivery</h3>
                <p className="font-medium text-gray-800">{getEstimatedDelivery()}</p>
              </div>
            </div>
            
            {/* Shipping and Customer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-gray-800 font-semibold mb-3 pb-2 border-b border-gray-200">Shipping Address</h3>
                <div className="text-gray-600">
                  <p className="font-medium">{data.order.shippingInfo?.firstName || "Customer"}</p>
                  <p>{data.order.shippingInfo?.address}</p>
                  <p>
                    {data.order.shippingInfo?.city}, {data.order.shippingInfo?.state} - {data.order.shippingInfo?.pinCode}
                  </p>
                  <p>Phone: {data.order.shippingInfo?.phoneNo}</p>
                </div>
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold mb-3 pb-2 border-b border-gray-200">Payment Information</h3>
                <div className="text-gray-600">
                  <p>Method: Credit Card</p>
                  <p>Status: {data.order.paymentStatus}</p>
                  <p className="mt-4 text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Receipt
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden mb-8">
              {data?.order?.orderItems?.map((item, index) => (
                <div 
                  key={item._id} 
                  className={`flex flex-col sm:flex-row items-start sm:items-center p-4 ${
                    index !== data.order.orderItems.length - 1 ? "border-b border-gray-200" : ""
                  }`}
                >
                  <div className="flex-shrink-0 w-20 h-20 bg-white rounded-md overflow-hidden shadow-sm">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-6 flex-grow">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    {item?.size && <p className="text-gray-500 text-sm">Size: {item.size}</p>}
                    <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <div className="mt-4 sm:mt-0 text-right">
                    <p className="font-medium text-gray-800">₹{item.price.toLocaleString()}</p>
                    <p className="text-gray-500 text-sm">per item</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary Totals */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-800 font-medium">₹{data.order.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-gray-800 font-medium">₹0</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax:</span>
                <span className="text-gray-800 font-medium">Included</span>
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
                <span className="text-lg font-bold text-gray-800">Total:</span>
                <span className="text-lg font-bold text-gray-800">₹{data.order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h3 className="text-blue-800 font-semibold mb-2">What happens next?</h3>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  You'll receive an order confirmation email with your order number
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Once your order ships, we'll send you a shipping confirmation with tracking info
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  You can track your order status anytime in your account dashboard
                </li>
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/orders")}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View All Orders
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Receipt
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Continue Shopping
              </button>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center border-t border-gray-200">
            <p className="text-gray-600">Need help with your order? <a href="/contact" className="text-blue-600 hover:underline">Contact our support team</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;