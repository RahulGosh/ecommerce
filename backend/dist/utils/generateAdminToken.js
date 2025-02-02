"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdminToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAdminToken = (res, user, userId, message, statusCode = 200) => {
    const jwtSecret = process.env.JWT_SECRET_KEY || "";
    // Generate token
    const adminToken = jsonwebtoken_1.default.sign({ userId }, jwtSecret);
    console.log(adminToken, "token backend");
    // Set cookie and send response
    res.status(statusCode)
        .cookie("adminToken", adminToken, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
        .json({
        success: true,
        message,
        userId,
        user,
    });
};
exports.generateAdminToken = generateAdminToken;
