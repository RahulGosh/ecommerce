import { CartResponse } from '../types/types';
import Title from './title';

const CartTotal = ({ cart }: { cart?: CartResponse }) => {
  if (!cart || !cart.subtotal || !cart.tax || !cart.shippingCharges || !cart.totalPrice) {
    return <div>Error: Cart data is incomplete</div>;
  }
  // const deliveryFee = 10; // Set your shipping fee here

  // // Calculate the totalAmount based on cart items and their quantities
  // const totalAmount = Object.keys(cart).reduce((acc, productId) => {
  //   const sizes = cart[productId];
  //   const productTotal = Object.keys(sizes).reduce((productAcc, size) => {
  //     const item = sizes[size];
  //     return productAcc + item.price * item.quantity; // Accumulate total price for each item in cart
  //   }, 0);
  //   return acc + productTotal;
  // }, 0);

  // const finalTotal = totalAmount + deliveryFee;

  console.log(cart, "cart")

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>${cart.subtotal}</p>
        </div>
        <div className="flex justify-between">
          <p>Tax</p>
          <p>${cart.tax.toFixed(2)}</p>
        </div>

        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>${cart.shippingCharges.toFixed(2)}</p>
        </div>

        <div className="flex justify-between">
          <p>Quantity</p>
          <p>${cart.cart.quantity.toFixed(2)}</p>
        </div>
        <hr />

        <div className="flex justify-between">
          <p>Total</p>
          <p>${cart.totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
