import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the User document
export interface UserSchema extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  cartData: Record<string, any>; // Flexible object for cart data
  shippingDetail: IShippingDetail; // Added type for shippingDetail
}

export interface IShippingDetail {
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


// Define the shipping detail schema
const shippingDetailSchema = new Schema<IShippingDetail>({
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

// Define the User schema
const userSchema: Schema<UserSchema> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
    },
    password: {
      type: String,
      required: true,
    },
    cartData: {
      type: Object,
      default: {}, // Default to an empty object
    },
    shippingDetail: shippingDetailSchema,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    minimize: false, // Ensures empty objects are not removed
  }
);

// Export the User model
export const User: Model<UserSchema> = mongoose.model<UserSchema>("User", userSchema);
