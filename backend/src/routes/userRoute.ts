import express, { Request, Response, NextFunction } from "express";
import {
  addToRecentlyViewed,
  adminLogin,
  createShippingDetail,
  forgotPassword,
  getAdminDetails,
  getProfile,
  getRecentlyViewed,
  getUserShippingDetail,
  login,
  logout,
  registerUser,
  resetPassword,
  updateShippingDetail,
} from "../controllers/userController";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { adminAuth } from "../middleware/adminAuth";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/admin-login").post(adminLogin);
router.route("/me").get(isAuthenticated, getProfile);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/getAdminDetail").get(adminAuth, getAdminDetails);
router.route("/logout").get(logout);
router
  .route("/create-shipping-detail")
  .post(isAuthenticated, createShippingDetail);
router.route("/shipping-detail").get(isAuthenticated, getUserShippingDetail);
router
  .route("/update-shipping-detail/")
  .put(isAuthenticated, updateShippingDetail);
router.route("/recently-viewed").get(isAuthenticated, getRecentlyViewed);
router
  .route("/add-to-recently-viewed/:productId")
  .post(isAuthenticated, addToRecentlyViewed);

export default router;
