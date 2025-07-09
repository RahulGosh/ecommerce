import { Document, Model, Schema, Types, model } from "mongoose";

interface ICoupon {
  code: string;
  discount: number;
  expiry: Date;
}

interface ICouponMethods {
  is_valid(): boolean;
}

type CouponDocument = Document<unknown, {}, ICoupon> &
  ICoupon & { _id: Types.ObjectId } & ICouponMethods;

type CouponModel = Model<ICoupon, {}, ICouponMethods>;

const couponSchema = new Schema<ICoupon, CouponModel, ICouponMethods>({
  code: { type: String, required: true },
  discount: { type: Number, required: true },
  expiry: { type: Date, required: true },
});

couponSchema.methods.is_valid = function (): boolean {
  const currentDate = new Date();
  return currentDate <= this.expiry;
};

export const Coupon = model<ICoupon, CouponModel>("Coupon", couponSchema);
export type { ICoupon, CouponDocument };
