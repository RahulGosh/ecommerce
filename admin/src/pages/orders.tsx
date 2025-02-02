import React, { useEffect, useState } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateStatusMutation,
  useUpdateStatusForCODMutation,
} from "../store/api/orderApi";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Loader from "../utils/loader";

const Orders = () => {
  const { data, isLoading } = useGetAllOrdersQuery();
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
      toast.success(updateStatusData.message || "Status Updated Successfully 2");
    }

    if (codStatusUpdated) {
      toast.success(codStatusUpdatedData.message || "Status Updated Successfully 2");
    }

    if (updateStatusError) {
      const errorData = (updateStatusError as FetchBaseQueryError)?.data as {
        message?: string;
      };
      toast.error(errorData?.message || "Failed to update status");
    }

    if (codStatusError) {
      const errorData = (codStatusError as FetchBaseQueryError)?.data as {
        message?: string;
      };
      toast.error(errorData?.message || "Failed to update status");
    }
  }, [updateStatusError, codStatusError]);

  const orders = data?.orders || [];

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const response = await updateStatus({
      orderId,
      shippingStatus: newStatus,
    }).unwrap();
    setOrderUpdated(true);
    toast.success(response.message || "Order status updated successfully!");
  };

  const handleCODStatusChange = async (
    orderId: string,
    paymentStatus: string
  ) => {
    if (paymentStatus === "Paid" || paymentStatus === "Unpaid") {
      const response = await updateStatusForCOD({
        orderId,
        paymentStatus,
      }).unwrap();
      toast.success(response.message || "COD status updated successfully!");
      setOrderUpdated(true);
    }
  };

  return (
    <div>
      {isLoading && <Loader />} {/* Show loader when fetching orders */}
      <h3>Order Page</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {orders.length > 0 ? (
          <>
            {orders.map((order, index) => (
              <div
                className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
                key={index}
              >
                <img className="w-12" src={assets.parcel_icon} alt="" />
                <div>
                  <div>
                    {order.orderItems.map((item, index) => (
                      <p className="py-0.5" key={index}>
                        {item.name} X {item.quantity} <span>{item.size}</span>
                      </p>
                    ))}
                  </div>
                  <p className="mt-3 mb-2 font-medium">
                    {order.shippingInfo.firstName +
                      " " +
                      order.shippingInfo.lastName}
                  </p>
                  <div>
                    <p>{order.shippingInfo.address + ", "} </p>
                    <p>
                      {order.shippingInfo.city +
                        ", " +
                        order.shippingInfo.state +
                        ", " +
                        order.shippingInfo.country +
                        ", " +
                        order.shippingInfo.pinCode}
                    </p>
                  </div>
                  <p>{order.shippingInfo.phoneNo}</p>
                </div>

                <div>
                  <p className="text-sm sm:text-[15px]">
                    Items: {order.orderItems.length}
                  </p>
                  <p className="mt-3">Method: {order.paymentMethod}</p>
                  <p>Payment: {order.paymentStatus ? "Paid" : "Unpaid"}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <p className="text-sm sm:text-[15px]">${order.totalPrice}</p>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <select
                    value={order.shippingStatus}
                    className="p-2 font-semibold"
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    disabled={isUpdating || isLoading} // Disable select when loading
                  >
                    {isUpdating || isLoading ? (
                      <option disabled>Loading...</option> // Use plain text instead of <CircularProgress>
                    ) : (
                      <>
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">
                          Out for delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                      </>
                    )}
                  </select>

                  {/* Payment status dropdown for COD orders */}
                  {order.paymentMethod === "COD" && (
                    <div className="flex flex-col sm:flex-row gap-3 items-start">
                      <select
                        value={order.paymentStatus}
                        className="p-2 font-semibold mt-2 sm:mt-0"
                        onChange={(e) =>
                          handleCODStatusChange(order._id, e.target.value)
                        }
                        disabled={isCODUpdating || isLoading}
                      >
                        {isCODUpdating || isLoading ? (
                          <option disabled>Loading...</option> // Use plain text instead of <CircularProgress>
                        ) : (
                          <>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid">Paid</option>
                          </>
                        )}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div>No orders found.</div>
        )}
      </div>
    </div>
  );
};

export default Orders;
