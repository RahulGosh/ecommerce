import mongoose, { Document, Schema, Types } from 'mongoose';

// Type for individual order item
export interface IOrderItem {
product: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  createdAt: Date;
  size: string;
  imageUrl: string;
}

// Type for shipping information
export interface IShippingInfo {
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

// Type for the entire order document
export interface IOrder extends Document {
  user: Types.ObjectId; // Reference to User schema
  orderItems: IOrderItem[];
  shippingInfo: IShippingInfo;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingStatus: string;
  stripeSessionId?: string; // Add this line
  paidAt?: Date;
  deliveredAt?: Date;
  createdAt: Date; // Automatically added by Mongoose with timestamps
  updatedAt: Date; // Automatically added by Mongoose with timestamps
}

// Order Item Schema
const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
});

// Shipping Info Schema
const shippingInfoSchema = new Schema<IShippingInfo>({
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

// Main Order Schema
const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [orderItemSchema],
    shippingInfo: shippingInfoSchema,
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      required: true,
      default: "Unpaid",
    },
    shippingStatus: {
      type: String,
      required: true,
      default: 'Order Placed',
    },
    stripeSessionId: {  // Add this new field
      type: String,
      index: true // Optional but recommended for better query performance
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export Order model
export const Order = mongoose.model<IOrder>('Order', orderSchema);
