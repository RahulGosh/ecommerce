"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.getAllOrders = exports.getUserOrders = exports.placeOrder = void 0;
const orderModel_1 = require("../models/orderModel");
const userModel_1 = require("../models/userModel");
const cartModel_1 = require("../models/cartModel");
const placeOrder = async (req, res) => {
    try {
        console.log(req.body); // Log the body to check its contents
        if (!req.user || !req.user._id) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        const userId = req.user._id;
        // Find the user's cart
        const cart = await cartModel_1.Cart.findOne({ user: userId });
        if (!cart || cart.items.length === 0) {
            res.status(400).json({ message: "Cart is empty" });
            return;
        }
        // Find the user
        const user = await userModel_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Check if user already has shipping details
        const existingShippingDetail = user.shippingDetail;
        if (!existingShippingDetail) {
            res.status(400).json({ message: "Shipping details are missing. Please provide shipping details." });
            return;
        }
        // Calculate the subtotal, tax, shipping charges, and total
        const itemsPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        const taxPrice = Math.round(itemsPrice * 0.3 * 100) / 100;
        const shippingPrice = cart.shippingCharges || 0;
        const totalPrice = itemsPrice + taxPrice + shippingPrice;
        // Create a new order
        const order = await orderModel_1.Order.create({
            user: userId,
            orderItems: cart.items.map((item) => ({
                product: item.product,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                imageUrl: item.imageUrl,
                size: item.size,
            })),
            shippingInfo: existingShippingDetail,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentMethod: "COD",
            payment: false, // Default payment status
            status: "Order Placed", // Default status
        });
        // Clear the cart after placing the order
        cart.items = [];
        cart.totalPrice = 0;
        cart.quantity = 0;
        await cart.save();
        res.status(201).json({
            message: "Order placed successfully",
            order,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error });
    }
};
exports.placeOrder = placeOrder;
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user?._id;
        const order = await orderModel_1.Order.find({ user: userId });
        if (!order) {
            res.status(404).json({ message: "Order not found or does not belong to the user" });
            return;
        }
        res.status(200).json({ order });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error });
    }
};
exports.getUserOrders = getUserOrders;
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel_1.Order.find({}).populate("user", "name email");
        if (!orders || orders.length === 0) {
            res.status(404).json({ message: "No orders found" });
            return;
        }
        res.status(200).json({ orders });
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Server error", error: error });
    }
};
exports.getAllOrders = getAllOrders;
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel_1.Order.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
};
exports.updateStatus = updateStatus;
