// In your cartSlice file
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  totalAmount: number; // Store the total amount here
}

const initialState: CartState = {
  cartItems: [],
  totalAmount: 0, // Initial total is 0
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem._id === item._id && cartItem.size === item.size
      );
      if (existingItem) {
        // Update quantity if item exists in cart
        existingItem.quantity += 1;
      } else {
        // Add item to cart
        state.cartItems.push({ ...item, quantity: 1 });
      }
      // Recalculate total amount whenever an item is added
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    removeFromCart(state, action: PayloadAction<string>) {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item._id !== itemId);
      // Recalculate total amount after removal
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    updateCartItemQuantity(
      state,
      action: PayloadAction<{ _id: string; size: string; quantity: number }>
    ) {
      const { _id, size, quantity } = action.payload;
      const item = state.cartItems.find(
        (cartItem) => cartItem._id === _id && cartItem.size === size
      );
      if (item) {
        item.quantity = quantity;
      }
      // Recalculate total amount after quantity update
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    clearCart(state) {
      state.cartItems = [];
      state.totalAmount = 0; // Reset total when the cart is cleared
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
