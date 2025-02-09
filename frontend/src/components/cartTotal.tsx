import { CartResponse } from "../types/types";
import Title from "./title";

const CartTotal = ({ cart }: { cart?: CartResponse }) => {
  const itemsPrice = cart?.itemsPrice || 0;
  const taxPrice = cart?.taxPrice || 0;
  const shippingPrice = cart?.shippingPrice || 0;
  const totalPrice = cart?.totalPrice || 0;
  const quantity = cart?.cart?.quantity || 0; // Default quantity to 0 if empty

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>${itemsPrice.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Tax</p>
          <p>${taxPrice.toFixed(2)}</p>
        </div>

        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>${shippingPrice.toFixed(2)}</p>
        </div>

        <div className="flex justify-between">
          <p>Quantity</p>
          <p>{quantity}</p>
        </div>
        <hr />

        <div className="flex justify-between font-bold">
          <p>Total</p>
          <p>${totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
