import express, { Request, Response, NextFunction } from "express";
import upload from "../utils/multer";
import { addProduct, getAllProducts, latestProductsCollection, removeProduct, singleProduct, updateProduct } from "../controllers/productController";
import { adminAuth } from "../middleware/adminAuth";

const router = express.Router();

router.route("/add-product").post(adminAuth, upload.array("images", 10), addProduct)
router.route("/products").get(getAllProducts)
router.route("/latest-products-collection").get(latestProductsCollection)
router.route("/remove-product").delete(adminAuth, removeProduct)
router.route("/update-product/:productId").put(adminAuth, upload.array("images", 10), updateProduct)
router.route("/product/:productId").get(singleProduct)

export default router;