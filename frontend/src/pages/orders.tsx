import Title from "../components/title";
import { useGetUserOrderQuery } from "../store/api/authApi";

const Orders = () => {
  const { data, isLoading, error, refetch } = useGetUserOrderQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading orders.</p>;
  }

  const orders = data?.order || [];

  if (orders.length === 0) {
    return <p>No orders available.</p>;
  }

  console.log(orders);
  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {orders.map((order) => (
        <div
          key={order._id}
          className="py-4 border-t border-b text-gray-700 flex flex-col gap-6"
        >
          <div className="flex justify-between items-center">
            <p className="text-base sm:text-lg font-medium">
              Order ID: {order._id}
            </p>
            <p className="text-sm text-gray-500">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          {order.orderItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-6 text-sm border p-4 rounded-lg"
            >
              <img
                src={item.imageUrl}
                alt={item.name || "Product Image"}
                className="w-16 sm:w-20"
              />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                  <p className="sm:text-base font-medium">
                    Price: ${item.price}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
              <p className="text-sm md:text-base">{order.paymentStatus}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
              <p className="text-sm md:text-base">{order.shippingStatus}</p>
            </div>
            <p className="text-sm">
              Shipping Price: ${order.shippingPrice.toFixed(2)}
            </p>
            <p className="text-sm">Tax: ${order.taxPrice.toFixed(2)}</p>
            <p className="text-sm font-medium">
              Total: ${order.totalPrice.toFixed(2)}
            </p>
            <button
              className="border px-4 py-2 text-sm font-medium rounded-sm"
              onClick={() => refetch()}
            >
              Track Order
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
