import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import {
  applyCoupon,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
} from "../controllers/couponController";
import { adminAuth } from "../middleware/adminAuth";

const router = express.Router();

// Create a new coupon
router.post("/coupons", isAuthenticated, adminAuth, createCoupon);

// Get a coupon by ID
router.get("/coupons/:couponId", getCouponById);

// Update a coupon
router.put("/coupons/:couponId", isAuthenticated, adminAuth, updateCoupon);

// Delete a coupon
router.delete("/coupons/:couponId", isAuthenticated, adminAuth, deleteCoupon);

// Get all coupons
router.get("/coupons", getAllCoupons);

// Apply coupon to a cart
router.put("/coupons/apply/:orderId", isAuthenticated, applyCoupon);

export default router;
