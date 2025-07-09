import { useEffect, useState } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateStatusMutation,
  useUpdateStatusForCODMutation,
} from "../store/api/orderApi";
import { toast } from "react-toastify";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { FiPackage, FiTruck, FiCheckCircle, FiDollarSign, FiCreditCard, FiClock, FiMapPin, FiPhone, FiUser, FiAlertCircle } from "react-icons/fi";
import Loader from "../utils/loader";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllOrdersQuery();
  const [
    updateStatus,
    {
      data: updateStatusData,
      isSuccess: statusUpdated,
      error: updateStatusError,
      isLoading: isUpdating,
    },
  ] = useUpdateStatusMutation();
  const [
    updateStatusForCOD,
    {
      data: codStatusUpdatedData,
      isSuccess: codStatusUpdated,
      error: codStatusError,
      isLoading: isCODUpdating,
    },
  ] = useUpdateStatusForCODMutation();

  const [orderUpdated, setOrderUpdated] = useState<boolean>(false);

  useEffect(() => {
    if (statusUpdated) {
      toast.success(
        <div className="flex items-center">
          <FiCheckCircle className="mr-2" />
          {updateStatusData.message || "Status Updated Successfully"}
        </div>
      );
      refetch();
    }

    if (codStatusUpdated) {
      toast.success(
        <div className="flex items-center">
          <FiDollarSign className="mr-2" />
          {codStatusUpdatedData.message || "Payment Status Updated"}
        </div>
      );
      refetch();
    }

    if (updateStatusError) {
      const errorData = (updateStatusError as FetchBaseQueryError)?.data as {
        message?: string;
      };
      toast.error(
        <div className="flex items-center">
          <FiAlertCircle className="mr-2" />
          {errorData?.message || "Failed to update status"}
        </div>
      );
    }

    if (codStatusError) {
      const errorData = (codStatusError as FetchBaseQueryError)?.data as {
        message?: string;
      };
      toast.error(
        <div className="flex items-center">
          <FiAlertCircle className="mr-2" />
          {errorData?.message || "Failed to update payment status"}
        </div>
      );
    }
  }, [statusUpdated, codStatusUpdated, updateStatusError, codStatusError, refetch]);

  const orders = data?.orders || [];

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({
        orderId,
        shippingStatus: newStatus,
      }).unwrap();
      setOrderUpdated(true);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleCODStatusChange = async (orderId: string, paymentStatus: string) => {
    if (paymentStatus === "Paid" || paymentStatus === "Unpaid") {
      try {
        await updateStatusForCOD({
          orderId,
          paymentStatus,
        }).unwrap();
        setOrderUpdated(true);
      } catch (error) {
        console.error("Failed to update COD status:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Order Placed":
        return "bg-blue-100 text-blue-800";
      case "Packing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Out for delivery":
        return "bg-orange-100 text-orange-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentColor = (status: string) => {
    return status === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
            <p className="text-gray-500">View and manage customer orders</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiPackage className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
            <p className="text-gray-500">When you receive orders, they'll appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">
                        <FiPackage className="text-blue-600" />
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <FiClock className="text-gray-400" />
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentColor(order?.paymentStatus)}`}>
                        {order.paymentMethod} - {order.paymentStatus}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.shippingStatus)}`}>
                        {order.shippingStatus}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        ${order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FiPackage className="text-gray-400" />
                        Order Items ({order.orderItems.length})
                      </h4>
                      <ul className="space-y-2">
                        {order.orderItems.map((item, index) => (
                          <li key={index} className="flex justify-between items-start border-b border-gray-100 pb-2">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                {item.quantity} × ${item.price.toFixed(2)} 
                                {item.size && ` • ${item.size}`}
                              </p>
                            </div>
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Shipping Information */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FiUser className="text-gray-400" />
                        Customer Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <FiMapPin className="mt-1 text-gray-400" />
                          <div>
                            <p className="font-medium">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                            <p className="text-sm text-gray-600">{order.shippingInfo.address}</p>
                            <p className="text-sm text-gray-600">
                              {order.shippingInfo.city}, {order.shippingInfo.state}, {order.shippingInfo.country} - {order.shippingInfo.pinCode}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FiPhone className="text-gray-400" />
                          <p className="text-sm text-gray-600">{order.shippingInfo.phoneNo}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Controls */}
                  <div className="mt-6 pt-5 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Status</label>
                        <select
                          value={order.shippingStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={isUpdating}
                          className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${isUpdating ? 'bg-gray-100' : ''}`}
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Packing">Packing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for delivery">Out for delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>

                      {order.paymentMethod === "COD" && (
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                          <select
                            value={order.paymentStatus ? "Paid" : "Unpaid"}
                            onChange={(e) => handleCODStatusChange(order._id, e.target.value)}
                            disabled={isCODUpdating}
                            className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${isCODUpdating ? 'bg-gray-100' : ''}`}
                          >
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid">Paid</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;