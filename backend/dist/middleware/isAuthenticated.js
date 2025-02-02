"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = require("../models/userModel");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.isAuthenticated = (0, express_async_handler_1.default)(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return next(new errorHandler_1.default("Token not found", 400));
        }
        const jwtSecret = process.env.JWT_SECRET_KEY || "";
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (!decoded || !decoded.userId) {
            return next(new errorHandler_1.default("Invalid Token or UserId not found", 401));
        }
        // Handle the case when the token is from an admin or regular user
        const userId = decoded.userId;
        const user = await userModel_1.User.findById(userId).select("_id name email");
        if (!user) {
            return next(new errorHandler_1.default("User not found", 401));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(new errorHandler_1.default("Invalid Token", 401));
    }
});
//# sourceMappingURL=isAuthenticated.js.map