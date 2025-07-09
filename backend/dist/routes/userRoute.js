"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const isAuthenticated_1 = require("../middleware/isAuthenticated");
const adminAuth_1 = require("../middleware/adminAuth");
const router = express_1.default.Router();
router.route("/register").post(userController_1.registerUser);
router.route("/login").post(userController_1.login);
router.route("/admin-login").post(userController_1.adminLogin);
router.route("/me").get(isAuthenticated_1.isAuthenticated, userController_1.getProfile);
router.route("/forgot-password").post(userController_1.forgotPassword);
router.route("/reset-password/:token").post(userController_1.resetPassword);
router.route("/getAdminDetail").get(adminAuth_1.adminAuth, userController_1.getAdminDetails);
router.route("/logout").get(userController_1.logout);
router.route("/create-shipping-detail").post(isAuthenticated_1.isAuthenticated, userController_1.createShippingDetail);
router.route("/shipping-detail").get(isAuthenticated_1.isAuthenticated, userController_1.getUserShippingDetail);
router.route("/update-shipping-detail/").put(isAuthenticated_1.isAuthenticated, userController_1.updateShippingDetail);
exports.default = router;
//# sourceMappingURL=userRoute.js.map