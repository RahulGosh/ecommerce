import { Request, Response, NextFunction } from "express";
import { Coupon, CouponDocument, ICoupon } from "../models/couponModel";
import { AuthenticatedRequest } from "../middleware/isAuthenticated";
import { Order } from "../models/orderModel";

export const createCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { code, discount, expiry } = req.body;

  const existingCoupon = await Coupon.findOne({ code });
  if (existingCoupon) {
     res.status(400).json({
      success: false,
      message: "Coupon with this code already exists",
    });
    return; 
}

  const coupon: ICoupon = await Coupon.create({
    code,
    discount, 
    expiry,
  });

  res.status(201).json({
    success: true,
    coupon,
  });
};

export const getCouponById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { couponId } = req.params;

  const coupon: ICoupon | null = await Coupon.findById(couponId);

  if (!coupon) {
    res.status(404).json({ message: "Coupon not found" });
    return;
  }

  res.status(200).json({
    success: true,
    coupon,
  });
};

export const updateCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { couponId } = req.params;
        const { code, discount, expiry } = req.body;
    
        const coupon = await Coupon.findByIdAndUpdate(
          couponId,
          { code, discount, expiry: new Date(expiry) },
          { new: true, runValidators: true }
        );
    
        if (!coupon) {
           res.status(404).json({
            success: false,
            message: "Coupon not found",
          });
          return;
        }
    
        res.status(200).json({
          success: true,
          coupon,
        });
      } catch (error) {
        next(error);
      }
  };

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { couponId } = req.params;

  const coupon: ICoupon | null = await Coupon.findByIdAndDelete(couponId);

  if (!coupon) {
     res.status(404).json({ message: "Coupon not found" });
     return;
  }

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
};

export const getAllCoupons = async (req: Request, res: Response, next: NextFunction) => {
  const coupons: ICoupon[] = await Coupon.find();

  res.status(200).json({
    success: true,
    coupons,
  });
};

export const applyCoupon = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const { couponCode } = req.body;
  const { orderId } = req.params;
  const userId = req.user?._id;

  try {
    const order = await Order.findOne({ _id: orderId, user: userId });
    
    if (!order) {
       res.status(404).json({ message: "Order not found" });
       return;
    }

    if (couponCode) {
      const coupon: ICoupon | null = await Coupon.findOne({
        code: couponCode,
        expiry: { $gte: new Date() },
      });

      if (!coupon) {
         res.status(404).json({ message: "Coupon not found or expired" });
         return;
      }

      const discount: number = coupon.discount;
      const totalPrice: number = order.totalPrice - discount;

      const formattedTotalPrice: string = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(totalPrice);

      order.totalPrice = totalPrice;
      await order.save();

      res.json({
        message: "Coupon applied successfully",
        order: { ...order.toObject(), totalPrice: formattedTotalPrice },
      });
    } else {
      res.status(400).json({ message: "Coupon code is required" });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while applying the coupon" });
  }
};