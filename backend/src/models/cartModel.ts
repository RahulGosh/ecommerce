import mongoose, { Document, Schema } from "mongoose";

interface IShippingDetail {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
  phoneNo: number;
}

interface CartItemSchema {
  product: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  createdAt: Date;
  size: string;
  imageUrl: string;
}

interface CartSchema extends Document {
  user: mongoose.Types.ObjectId;
  shippingInfo: IShippingDetail;
  items: CartItemSchema[];
  quantity: number;
  totalPrice: number;
  shippingCharges: number;  // Add shippingCharges here
  createdAt: Date;
}

// Shipping info schema
const shippingInfoSchema = new Schema<IShippingDetail>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  pinCode: {
    type: Number,
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
});

const cartSchema = new Schema<CartSchema>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  shippingInfo: shippingInfoSchema,
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now },
      size: {
        type: String,
        required: true,
      },
      imageUrl: {
        type: String,
        required: true,
      },
    },
  ],
  quantity: { type: Number, default: 1 },
  totalPrice: { type: Number, default: 0 },
  shippingCharges: { type: Number, default: 0 },  // Define shippingCharges here
  createdAt: { type: Date, default: Date.now },
});

export const Cart = mongoose.model<CartSchema>("Cart", cartSchema);
