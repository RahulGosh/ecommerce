"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateUserToken = (res, user, userId, message, statusCode = 200) => {
    const jwtSecret = process.env.JWT_SECRET_KEY || "";
    // Generate token
    const token = jsonwebtoken_1.default.sign({ userId }, jwtSecret);
    console.log(token, "token backend");
    // Set cookie and send response
    res.status(statusCode)
        .cookie("token", token, {
        httpOnly: true,
        // secure: isProduction,
        secure: true, // Only use secure in production
        // sameSite: isProduction ? 'none' : 'lax',
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
        path: '/'
    })
        .json({
        success: true,
        message,
        userId,
        user,
    });
};
exports.generateUserToken = generateUserToken;
//# sourceMappingURL=generateUserToken.js.map