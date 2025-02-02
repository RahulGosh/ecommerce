"use strict";
// import { Request, Response } from "express";
// import { Product } from "../models/productModel";
// import { User } from "../models/userModel";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItemFromCart = exports.updateCart = exports.getUserCart = exports.addToCart = void 0;
const userModel_1 = require("../models/userModel");
const productModel_1 = require("../models/productModel");
const cartModel_1 = require("../models/cartModel");
const mongoose_1 = __importDefault(require("mongoose"));
const addToCart = async (req, res) => {
    console.log("Step 1: Entered addToCart function");
    const { productId } = req.params;
    console.log("Step 2: Params -", req.params);
    const { size } = req.body;
    console.log("Step 3: Body -", req.body);
    const userId = req.user?._id;
    console.log("Step 4: User ID -", userId);
    if (!size) {
        console.log("Step 5: Size missing");
        res.status(400).json({ message: "Size is required" });
        return;
    }
    try {
        console.log("Step 6: Looking for user");
        const user = await userModel_1.User.findById(userId);
        if (!user) {
            console.log("Step 7: User not found");
            res.status(404).json({ message: "User not found" });
            return;
        }
        console.log("Step 8: Looking for product");
        const product = await productModel_1.Product.findById(productId);
        if (!product) {
            console.log("Step 9: Product not found");
            res.status(404).json({ message: "Product not found" });
            return;
        }
        console.log("Step 10: Looking for cart");
        let cart = await cartModel_1.Cart.findOne({ user: userId });
        if (!cart) {
            console.log("Step 11: Creating new cart");
            cart = new cartModel_1.Cart({
                user: userId,
                items: [],
                quantity: 0,
                totalPrice: 0,
            });
        }
        console.log("Step 12: Validating size");
        if (!product.sizes.includes(size)) {
            console.log("Step 13: Invalid size");
            res.status(400).json({ message: "Invalid size selected" });
            return;
        }
        console.log("Step 14: Updating cart items");
        const existingItem = cart.items.find((item) => item.product.toString() === productId.toString() && item.size === size);
        const productObjectId = new mongoose_1.default.Types.ObjectId(productId); // Convert to ObjectId
        if (existingItem) {
            existingItem.quantity++;
        }
        else {
            cart.items.push({
                product: productObjectId,
                name: product.name,
                size,
                quantity: 1,
                price: product.price,
                imageUrl: product.images[0]?.imageUrl,
                createdAt: new Date(),
            });
        }
        cart.quantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        const subtotal = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        const tax = Math.round(subtotal * 0.3 * 100) / 100;
        const userCountry = user.shippingDetail?.country;
        cart.shippingCharges = userCountry === "India" ? 20 : 100;
        cart.totalPrice = subtotal + tax + cart.shippingCharges;
        console.log("Step 15: Saving cart");
        await cart.save();
        console.log("Step 16: Sending response");
        res.json({
            cart,
            totalPrice: cart.totalPrice,
            subtotal,
            tax,
            shippingCharges: cart.shippingCharges,
        });
    }
    catch (error) {
        console.error("Step 17: Error occurred", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.addToCart = addToCart;
const getUserCart = async (req, res) => {
    const userId = req.user?._id;
    try {
        const cart = await cartModel_1.Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }
        const subtotal = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        const tax = Math.round(subtotal * 0.3 * 100) / 100;
        const user = await userModel_1.User.findById(userId);
        const userCountry = user?.shippingDetail?.country;
        const shippingCharges = userCountry === "India" ? 20 : 100;
        const totalPrice = subtotal + tax + shippingCharges;
        res.json({ cart, totalPrice, subtotal, tax, shippingCharges });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getUserCart = getUserCart;
const updateCart = async (req, res) => {
    const { productId } = req.params;
    const { size, quantity } = req.body; // Accept quantity as part of the body
    const userId = req.user?._id;
    try {
        // Find the cart for the user
        const cart = await cartModel_1.Cart.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }
        // Find the specific item in the cart
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId && (!size || item.size === size));
        if (itemIndex !== -1) {
            // Update size if provided
            if (size)
                cart.items[itemIndex].size = size;
            // Update quantity if provided
            if (quantity !== undefined) {
                if (quantity < 1) {
                    res.status(400).json({ message: "Quantity must be at least 1" });
                    return;
                }
                cart.items[itemIndex].quantity = quantity;
            }
            // Recalculate cart totals
            cart.quantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
            const subtotal = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
            const tax = Math.round(subtotal * 0.3 * 100) / 100;
            const user = await userModel_1.User.findById(userId);
            const userCountry = user?.shippingDetail?.country;
            cart.shippingCharges = userCountry === "India" ? 20 : 100;
            cart.totalPrice = subtotal + tax + cart.shippingCharges;
            // Save updated cart
            await cart.save();
            res.json({ cart, subtotal, tax, shippingCharges: cart.shippingCharges, totalPrice: cart.totalPrice });
        }
        else {
            res.status(404).json({ message: "Item not found in cart" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateCart = updateCart;
const removeItemFromCart = async (req, res) => {
    const { productId } = req.params;
    const { size } = req.body; // Accept quantity as part of the body
    const userId = req.user?._id;
    try {
        const cart = await cartModel_1.Cart.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }
        cart.items = cart.items.filter((item) => !(item.product.toString() === productId && item.size === size));
        cart.quantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        await cart.save();
        res.json({ cart });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.removeItemFromCart = removeItemFromCart;
