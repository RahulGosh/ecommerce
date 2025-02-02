"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminAuth = (req, res, next) => {
    try {
        const adminToken = req.cookies.adminToken;
        if (!adminToken) {
            res.status(401).json({
                success: false,
                message: "Not Authorized. Login Again.",
            });
            return;
        }
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
        }
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminEmail || !adminPassword) {
            throw new Error("Admin credentials (email or password) are missing in environment variables.");
        }
        const tokenDecode = jsonwebtoken_1.default.verify(adminToken, secretKey);
        const expectedPayload = adminEmail + adminPassword;
        console.log(tokenDecode, "tokenDecode");
        console.log(expectedPayload, "expectedPayload");
        console.log(adminEmail, "adminEmail");
        console.log(adminPassword, "adminPassword");
        console.log(adminToken, "token");
        if (tokenDecode.data !== expectedPayload) {
            res.status(401).json({
                success: false,
                message: "Not Authorized. Login Again.",
            });
            return;
        }
        next(); // Proceed if authorized
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
exports.adminAuth = adminAuth;
//# sourceMappingURL=adminAuth.js.map