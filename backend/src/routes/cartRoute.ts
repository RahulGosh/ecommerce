import express, { Request, Response, NextFunction } from "express";
import { addToCart, getUserCart, removeItemFromCart, updateCart } from "../controllers/cartController";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router();

router.route("/getUserCart").post(isAuthenticated, getUserCart)
router.route("/add-to-cart/:productId").post(isAuthenticated, addToCart);
router.route("/update-cart/:productId").put(isAuthenticated, updateCart)
router.route("/remove-item/:productId").delete(isAuthenticated, removeItemFromCart)

export default router;