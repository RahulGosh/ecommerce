import mongoose, { Schema, Document, Model, Types } from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// Define an interface for the User document
export interface UserSchema extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  cartData: Record<string, any>;
  shippingDetail: IShippingDetail;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  recentlyViewed: Types.ObjectId[]; // Add this line
  getResetPasswordToken: () => string;
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

const shippingDetailSchema = new Schema<IShippingDetail>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pinCode: { type: Number, required: true },
  phoneNo: { type: Number, required: true },
});

// Define the User schema
const userSchema: Schema<UserSchema> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    shippingDetail: shippingDetailSchema,
    resetPasswordToken: { type: String },
    recentlyViewed: { 
      type: [Schema.Types.ObjectId], 
      ref: 'Product',
      default: [] 
    },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true, minimize: false }
);

// **Add the getResetPasswordToken method**
userSchema.methods.getResetPasswordToken = function (): string {
  // Generate a token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Set token expiration time (15 minutes)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken; // Return the unhashed token to send via email
};

// Export the User model
export const User: Model<UserSchema> = mongoose.model<UserSchema>("User", userSchema);
