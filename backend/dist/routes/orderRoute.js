"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = require("../middleware/isAuthenticated");
const orderController_1 = require("../controllers/orderController");
const adminAuth_1 = require("../middleware/adminAuth");
const router = express_1.default.Router();
router.route("/place-order").post(isAuthenticated_1.isAuthenticated, orderController_1.placeOrder);
router.route("/update-status").put(adminAuth_1.adminAuth, orderController_1.updateStatus);
router.route("/update-status/cod").put(adminAuth_1.adminAuth, orderController_1.updateStatusForCOD);
router.route("/orders").get(adminAuth_1.adminAuth, (req, res) => {
    (0, orderController_1.getAllOrders)(req, res);
});
;
router.route("/user-orders").get(isAuthenticated_1.isAuthenticated, (req, res) => {
    (0, orderController_1.getUserOrders)(req, res);
});
router.route("/place-order/stripe").post(isAuthenticated_1.isAuthenticated, orderController_1.placeOrderWithStripe);
router.route("/webhook").post(express_1.default.raw({ type: "application/json" }), orderController_1.stripeWebhook);
exports.default = router;
//# sourceMappingURL=orderRoute.js.map