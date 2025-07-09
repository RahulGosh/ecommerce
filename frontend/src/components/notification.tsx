// src/components/OrderNotification.tsx
import { useEffect, useState } from "react";

const OrderNotification = ({ message, orderId }: { message: string; orderId: string }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in">
      <p className="font-medium">Order #{orderId.slice(-6)}</p>
      <p>{message}</p>
    </div>
  );
};

export default OrderNotification;