import Title from "../components/title";
import { useGetUserOrderQuery } from "../store/api/authApi";
import { Clock, Package, CreditCard, TruckIcon, RefreshCw } from "lucide-react";
import { useState } from "react";

// TypeScript interfaces for order data
interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface ShippingInfo {
  address: string;
  city: string;
  pinCode: string;
}

interface Order {
  _id: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  shippingInfo?: ShippingInfo;
  shippingPrice: number;
  shippingStatus: string;
  paymentStatus: string;
  taxPrice: number;
  totalPrice: number;
}

interface OrderResponse {
  order: Order[];
}

// Define order status types
type OrderStatus = 
  | "Order Placed" 
  | "Packing" 
  | "Shipped" 
  | "Out for Delivery" 
  | "Delivered";

const Orders = () => {
  const { data, isLoading, error, refetch } = useGetUserOrderQuery<{ data: OrderResponse | undefined, isLoading: boolean, error: any, refetch: () => void }>();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-center">
        <p className="text-red-600">Error loading your orders. Please try again later.</p>
        <button 
          onClick={() => refetch()}
          className="mt-4 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const orders = data?.order || [];

  if (orders.length === 0) {
    return (
      <div className="border-t pt-16 min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-lg">
        <Package size={48} className="text-gray-400 mb-4" />
        <p className="text-lg text-gray-600">You haven't placed any orders yet.</p>
        <a href="/shop" className="mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors">
          Start Shopping
        </a>
      </div>
    );
  }

  const toggleExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'delivered':
      case 'completed':
        return 'bg-green-500';
      case 'pending':
      case 'processing':
      case 'packing':
      case 'shipped':
      case 'out for delivery':
        return 'bg-yellow-500';
      case 'cancelled':
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Check if a status is active based on the current shipping status
  const isStatusActive = (currentStatus: string, checkStatus: OrderStatus): boolean => {
    const statusOrder: OrderStatus[] = ["Order Placed", "Packing", "Shipped", "Out for Delivery", "Delivered"];
    const currentIndex = statusOrder.findIndex(s => s.toLowerCase() === currentStatus.toLowerCase());
    const checkIndex = statusOrder.findIndex(s => s === checkStatus);
    
    return currentIndex >= checkIndex;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12 flex justify-between items-center">
        <div>
          <Title text1={"MY"} text2={"ORDERS"} />
          <p className="text-gray-600 mt-2">Track and manage your purchases</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Order Header */}
            <div className="bg-gray-50 p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">Order ID:</span>
                  <span className="text-gray-700 font-mono text-sm">{order._id}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock size={14} />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                {/* Payment Status */}
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(order.paymentStatus)}`}></span>
                  <span className="text-sm">{order.paymentStatus}</span>
                </div>

                {/* Shipping Status */}
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(order.shippingStatus)}`}></span>
                  <span className="text-sm">{order.shippingStatus}</span>
                </div>

                {/* Total */}
                <div className="text-sm font-medium">
                  ${order.totalPrice.toFixed(2)}
                </div>

                {/* Track Button */}
                <button
                  className="bg-black text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                  onClick={() => toggleExpand(order._id)}
                >
                  {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                </button>
              </div>
            </div>

            {/* Order Details (Expandable) */}
            {expandedOrder === order._id && (
              <div className="p-4 sm:p-6 space-y-6">
                {/* Order Items */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 text-lg">Items</h3>
                  {order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-20 h-20 bg-white rounded-md overflow-hidden border flex items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name || "Product Image"}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Package size={24} className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <div className="mt-2 text-sm text-gray-600">
                          <div className="grid grid-cols-2 gap-2">
                            <div>Price: <span className="font-medium">${item.price}</span></div>
                            <div>Quantity: <span className="font-medium">{item.quantity}</span></div>
                            <div>Subtotal: <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 text-lg mb-4">Order Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shipping and Payment Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <TruckIcon size={16} className="text-gray-600" />
                        <h4 className="font-medium">Shipping Details</h4>
                      </div>
                      <div className="text-sm space-y-2 text-gray-600">
                        <p>Shipping Price: <span className="font-medium">${order.shippingPrice.toFixed(2)}</span></p>
                        <p>Status: <span className="font-medium">{order.shippingStatus}</span></p>
                        {order?.shippingInfo && (
                          <p className="mt-2">
                            {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.pinCode}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard size={16} className="text-gray-600" />
                        <h4 className="font-medium">Payment Details</h4>
                      </div>
                      <div className="text-sm space-y-2 text-gray-600">
                        <p>Payment Status: <span className="font-medium">{order.paymentStatus}</span></p>
                        <p>Tax: <span className="font-medium">${order.taxPrice.toFixed(2)}</span></p>
                        <p>Total: <span className="font-medium">${order.totalPrice.toFixed(2)}</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Information - Updated with 5 statuses */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 text-lg mb-4">Tracking Information</h3>
                  <div className="relative">
                    <div className="absolute left-0 top-0 h-full w-px bg-gray-200"></div>
                    <div className="space-y-6 ml-6">
                      {/* Order Placed */}
                      <div className="relative">
                        <div className="absolute -left-6 top-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                        <div>
                          <p className="font-medium">Order Placed</p>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      
                      {/* Payment Status */}
                      <div className="relative">
                        <div className={`absolute -left-6 top-0 w-3 h-3 rounded-full ${order.paymentStatus.toLowerCase() === 'paid' ? 'bg-green-500' : 'bg-gray-300'} border-2 border-white`}></div>
                        <div>
                          <p className="font-medium">Payment {order.paymentStatus}</p>
                          <p className="text-sm text-gray-500">{order.paymentStatus.toLowerCase() === 'paid' ? formatDate(order.updatedAt) : 'Pending'}</p>
                        </div>
                      </div>
                      
                      {/* Packing */}
                      <div className="relative">
                        <div className={`absolute -left-6 top-0 w-3 h-3 rounded-full ${isStatusActive(order.shippingStatus, "Packing") ? 'bg-green-500' : 'bg-gray-300'} border-2 border-white`}></div>
                        <div>
                          <p className="font-medium">Packing</p>
                          <p className="text-sm text-gray-500">{isStatusActive(order.shippingStatus, "Packing") ? 'Your order is being packed' : 'Pending'}</p>
                        </div>
                      </div>
                      
                      {/* Shipped */}
                      <div className="relative">
                        <div className={`absolute -left-6 top-0 w-3 h-3 rounded-full ${isStatusActive(order.shippingStatus, "Shipped") ? 'bg-green-500' : 'bg-gray-300'} border-2 border-white`}></div>
                        <div>
                          <p className="font-medium">Shipped</p>
                          <p className="text-sm text-gray-500">{isStatusActive(order.shippingStatus, "Shipped") ? 'In transit' : 'Processing'}</p>
                        </div>
                      </div>
                      
                      {/* Out for Delivery */}
                      <div className="relative">
                        <div className={`absolute -left-6 top-0 w-3 h-3 rounded-full ${isStatusActive(order.shippingStatus, "Out for Delivery") ? 'bg-green-500' : 'bg-gray-300'} border-2 border-white`}></div>
                        <div>
                          <p className="font-medium">Out for Delivery</p>
                          <p className="text-sm text-gray-500">{isStatusActive(order.shippingStatus, "Out for Delivery") ? 'Your order is on its way' : 'Pending'}</p>
                        </div>
                      </div>
                      
                      {/* Delivered */}
                      <div className="relative">
                        <div className={`absolute -left-6 top-0 w-3 h-3 rounded-full ${isStatusActive(order.shippingStatus, "Delivered") ? 'bg-green-500' : 'bg-gray-300'} border-2 border-white`}></div>
                        <div>
                          <p className="font-medium">Delivered</p>
                          <p className="text-sm text-gray-500">{isStatusActive(order.shippingStatus, "Delivered") ? 'Completed' : 'Pending'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    onClick={() => window.print()}
                  >
                    Print Receipt
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                    onClick={() => refetch()}
                  >
                    Track Order
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;