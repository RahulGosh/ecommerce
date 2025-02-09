"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../utils/multer"));
const productController_1 = require("../controllers/productController");
const adminAuth_1 = require("../middleware/adminAuth");
const router = express_1.default.Router();
router.route("/add-product").post(adminAuth_1.adminAuth, multer_1.default.array("images", 10), productController_1.addProduct);
router.route("/products").get(productController_1.getAllProducts);
router.route("/latest-products-collection").get(productController_1.latestProductsCollection);
router.route("/remove-product").delete(adminAuth_1.adminAuth, productController_1.removeProduct);
router.route("/product/:productId").get(productController_1.singleProduct);
exports.default = router;
//# sourceMappingURL=productRoute.js.map