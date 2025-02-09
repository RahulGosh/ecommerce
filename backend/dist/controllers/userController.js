"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.updateShippingDetail = exports.getUserShippingDetail = exports.createShippingDetail = exports.logout = exports.getAdminDetails = exports.getProfile = exports.adminLogin = exports.login = exports.registerUser = void 0;
const userModel_1 = require("../models/userModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const generateUserToken_1 = require("../utils/generateUserToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // Check for missing fields
        if (!name || !email || !password) {
            res.status(400).json({ message: "Please enter all fields" });
            return; // Prevent further execution
        }
        const userExists = await userModel_1.User.findOne({ email });
        if (userExists) {
            res.status(400).json({ success: false, message: "User already exists" });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await userModel_1.User.create({
            name,
            email,
            password: hashedPassword,
            cartData: {}
        });
        await user.save();
        if (user) {
            (0, generateUserToken_1.generateUserToken)(res, user, user?._id, "Registered Successfully", 201);
            res.status(200).json({ userId: user._id });
        }
        else {
            return next(new errorHandler_1.default("An error occurred in creating the user", 400));
        }
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
const login = async (req, // Typing request body
res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required",
            });
            return;
        }
        const user = await userModel_1.User.findOne({ email });
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Incorrect email or password",
            });
            return;
        }
        const isPasswordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(400).json({
                success: false,
                message: "Incorrect email or password",
            });
            return;
        }
        (0, generateUserToken_1.generateUserToken)(res, user, user._id.toString(), `Welcome back ${user.name}`, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Check for missing fields
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Please provide both email and password",
            });
            return;
        }
        // Verify admin credentials
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminEmail || !adminPassword) {
            throw new Error("Admin credentials are not properly configured in environment variables.");
        }
        if (email !== adminEmail || password !== adminPassword) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        // Generate a JWT token for the admin
        const secretKey = process.env.JWT_SECRET_KEY;
        const adminPayload = {
            data: adminEmail + adminPassword, // Unique identifier for admin
        };
        const adminToken = jsonwebtoken_1.default.sign(adminPayload, secretKey, { expiresIn: "1d" });
        // Set the adminToken in a cookie
        res.cookie("adminToken", adminToken, {
            httpOnly: true,
            // secure: isProduction,
            secure: true, // Only use secure in production
            // sameSite: isProduction ? 'none' : 'lax',
            sameSite: "none",
            maxAge: 15 * 60 * 1000,
            path: '/'
        });
        res.status(200).json({
            success: true,
            message: "Admin logged in successfully",
            adminToken,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.adminLogin = adminLogin;
const getProfile = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Please login first"
            });
            return;
        }
        // First, check if it's an admin by comparing with env variables
        if (req.user?.email === process.env.ADMIN_EMAIL) {
            // Return admin profile
            const adminProfile = {
                name: "Admin",
                email: process.env.ADMIN_EMAIL,
                isAdmin: true,
                permissions: ['full_access'],
                lastLogin: new Date().toISOString()
            };
            res.status(200).json({
                success: true,
                profile: adminProfile
            });
            return;
        }
        // If not admin, return user profile
        const user = await userModel_1.User.findById(req.user?._id).select("-password");
        if (!user) {
            return next(new errorHandler_1.default("User not found", 404));
        }
        res.status(200).json({
            success: true,
            profile: {
                ...user.toObject(),
                isAdmin: false
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
const getAdminDetails = (req, res, next) => {
    try {
        const adminToken = req.cookies.adminToken; // Retrieve the adminToken from cookies
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!adminToken) {
            res.status(401).json({
                success: false,
                message: "Not Authorized. Please log in as admin.",
            });
            return;
        }
        if (!secretKey) {
            throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
        }
        const adminName = process.env.ADMIN_NAME;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminName || !adminEmail || !adminPassword) {
            throw new Error("Admin credentials (name, email, or password) are not properly configured in environment variables.");
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(adminToken, secretKey);
        const expectedPayload = adminEmail + adminPassword;
        if (decoded.data !== expectedPayload) {
            res.status(401).json({
                success: false,
                message: "Invalid token or not authorized as admin.",
            });
            return;
        }
        // Return admin details
        res.status(200).json({
            success: true,
            admin: {
                name: adminName,
                email: adminEmail,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
exports.getAdminDetails = getAdminDetails;
const logout = async (req, res, next) => {
    try {
        res.cookie("token", "", {
            expires: new Date(0),
            httpOnly: true,
        });
        res.status(200).json({
            success: true,
            message: "Logged out successfully!",
        });
    }
    catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to log out. Please try again.",
        });
    }
};
exports.logout = logout;
const createShippingDetail = async (req, res) => {
    try {
        const { userId, shippingDetail } = req.body;
        // Validate input fields
        if (!shippingDetail ||
            !shippingDetail.firstName ||
            !shippingDetail.lastName ||
            !shippingDetail.email ||
            !shippingDetail.address ||
            !shippingDetail.state ||
            !shippingDetail.city ||
            !shippingDetail.country ||
            !shippingDetail.pinCode ||
            !shippingDetail.phoneNo) {
            res.status(400).json({ message: "All shipping details are required" });
            return;
        }
        // Find the user by userId and update the shipping detail
        const user = await userModel_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Update the shipping detail
        user.shippingDetail = shippingDetail;
        await user.save(); // Save the updated user document
        res.status(200).json({
            message: "Shipping details updated successfully",
            shippingDetail: user.shippingDetail,
        });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
        return;
    }
};
exports.createShippingDetail = createShippingDetail;
const getUserShippingDetail = async (req, res) => {
    try {
        const userId = req.user?._id;
        // Validate userId is provided
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        // Find the user by userId
        const user = await userModel_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Check if the user has shipping details
        if (!user.shippingDetail) {
            res.status(404).json({ message: "Shipping details not found" });
            return;
        }
        // Return the user's shipping details
        res.status(200).json({
            message: "Shipping details fetched successfully",
            shippingDetail: user.shippingDetail,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getUserShippingDetail = getUserShippingDetail;
const updateShippingDetail = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { shippingDetail } = req.body;
        console.log("Request Body:", req.body);
        // Check if the request body contains `shippingDetail` or direct fields
        const resolvedShippingDetail = shippingDetail || req.body;
        // Validate input fields
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        if (!resolvedShippingDetail || Object.keys(resolvedShippingDetail).length === 0) {
            console.log("Received Shipping Details:", resolvedShippingDetail);
            res.status(400).json({ message: "No shipping details provided to update" });
            return;
        }
        // Find the user by userId
        const user = await userModel_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Merge the existing shipping details with the new ones
        user.shippingDetail = {
            ...user.shippingDetail, // Retain existing fields
            ...resolvedShippingDetail, // Overwrite with new fields
        };
        // Save the updated user document
        await user.save();
        res.status(200).json({
            message: "Shipping details updated successfully",
            shippingDetail: user.shippingDetail,
        });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateShippingDetail = updateShippingDetail;
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userModel_1.User.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        // Generate reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
        // Reset password URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        // Email message
        const message = `
      <h2>Password Reset Request</h2>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
    `;
        try {
            await (0, sendEmail_1.default)({
                email: user.email,
                subject: "Password Reset Request",
                message,
            });
            res.status(200).json({ success: true, message: "Password reset email sent" });
        }
        catch (error) {
            console.error("Email sending error:", error); // Log error to console
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.status(500).json({ success: false, message: "Email could not be sent" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params; // Token from URL
        const { password } = req.body; // New password
        // Hash the token to match the stored one
        const resetPasswordToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
        // Find user by reset token and check expiration
        const user = await userModel_1.User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }, // Token should not be expired
        });
        if (!user) {
            res.status(400).json({ success: false, message: "Invalid or expired token" });
            return;
        }
        // Hash new password
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(password, salt);
        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({ success: true, message: "Password reset successful" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=userController.js.map