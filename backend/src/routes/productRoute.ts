import express, { Request, Response, NextFunction } from "express";
import upload from "../utils/multer";
import { addProduct, getAllProducts, removeProduct, singleProduct } from "../controllers/productController";
import { adminAuth } from "../middleware/adminAuth";

const router = express.Router();

router.route("/add-product").post(adminAuth, upload.array("images", 10), addProduct)
router.route("/products").get(getAllProducts)
router.route("/remove-product").delete(adminAuth, removeProduct)
router.route("/product/:productId").get(singleProduct)

export default router;