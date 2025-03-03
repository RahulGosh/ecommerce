import express, { Request, Response, NextFunction } from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { AddToCartRequest, GetAllOrderRequest, getAllOrders, getUserOrders, placeOrder, placeOrderWithStripe, PlaceOrderWithStripeRequest, stripeWebhook, updateStatus, updateStatusForCOD } from "../controllers/orderController";
import { adminAuth } from "../middleware/adminAuth";
import { AuthenticatedRequest, CreateCourseCustomRequest } from "../types/types";

const router = express.Router();

router.route("/place-order").post(isAuthenticated, placeOrder);
router.route("/update-status").put(adminAuth, updateStatus);
router.route("/update-status/cod").put(adminAuth, updateStatusForCOD);
router.route("/orders").get(adminAuth, (req: Request, res: Response) => {
  getAllOrders(req as GetAllOrderRequest, res);
});;
router.route("/user-orders").get(isAuthenticated, (req: Request, res: Response) => {
  getUserOrders(req as AddToCartRequest, res);
});

router.route("/place-order/stripe").post(isAuthenticated,
  placeOrderWithStripe
);

router.route("/webhook").post(express.raw({ type: "application/json" }), stripeWebhook);

export default router;