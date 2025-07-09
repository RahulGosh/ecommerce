"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const isAuthenticated_1 = require("../middleware/isAuthenticated");
const router = express_1.default.Router();
router.route("/getUserCart").post(isAuthenticated_1.isAuthenticated, cartController_1.getUserCart);
router.route("/add-to-cart/:productId").post(isAuthenticated_1.isAuthenticated, cartController_1.addToCart);
router.route("/update-cart/:productId").put(isAuthenticated_1.isAuthenticated, cartController_1.updateCart);
router.route("/remove-item/:productId").delete(isAuthenticated_1.isAuthenticated, cartController_1.removeItemFromCart);
exports.default = router;
//# sourceMappingURL=cartRoute.js.map