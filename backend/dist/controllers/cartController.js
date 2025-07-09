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
const calculateShippingPrice = (quantity, itemsPrice) => {
    if (itemsPrice >= 5000)
        return 0; // Free shipping for orders above $500
    if (quantity <= 2)
        return 150; // $5 for small orders
    if (quantity <= 5)
        return 250; // $10 for medium orders
    return 15; // $15 for large orders
};
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
        const productObjectId = new mongoose_1.default.Types.ObjectId(productId); // Convert to ObjectId
        const existingItem = cart.items.find((item) => item.product.toString() === productId.toString() && item.size === size);
        if (existingItem) {
            existingItem.quantity++; // Increment quantity if item already exists
        }
        else {
            cart.items.push({
                product: productObjectId,
                name: product.name,
                size,
                quantity: 1, // Set initial quantity to 1
                price: product.price,
                imageUrl: product.images[0]?.imageUrl,
                createdAt: new Date(),
            });
        }
        // Recalculate total cart quantity & price
        cart.quantity = cart.items.reduce((total, item) => total + item.quantity, 0);
        const itemsPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        const taxPrice = Math.round(itemsPrice * 0.3 * 100) / 100;
        const shippingPrice = calculateShippingPrice(cart.quantity, itemsPrice);
        const totalPrice = itemsPrice + taxPrice + shippingPrice;
        cart.shippingPrice = shippingPrice;
        cart.totalPrice = totalPrice;
        console.log("Cart Quantity:", cart.quantity);
        console.log("Items Price:", itemsPrice);
        console.log("Calculated Shipping Price:", calculateShippingPrice(cart.quantity, itemsPrice));
        console.log("Step 15: Saving cart");
        await cart.save();
        console.log("Step 16: Sending response");
        res.json({
            cart,
            totalPrice,
            itemsPrice,
            taxPrice,
            shippingPrice,
            success: true,
            message: "Item added to cart",
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
        cart.quantity = cart.items.reduce((total, item) => total + item.quantity, 0);
        const itemsPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        const taxPrice = Math.round(itemsPrice * 0.3 * 100) / 100;
        const shippingPrice = calculateShippingPrice(cart.quantity, itemsPrice);
        const totalPrice = itemsPrice + taxPrice + shippingPrice;
        cart.shippingPrice = shippingPrice;
        cart.totalPrice = totalPrice;
        console.log("Cart Quantity:", cart.quantity);
        console.log("Items Price:", itemsPrice);
        console.log("Calculated Shipping Price:", calculateShippingPrice(cart.quantity, itemsPrice));
        cart.itemsPrice = itemsPrice;
        cart.taxPrice = taxPrice;
        // If the cart is empty, reset everything
        if (cart.quantity === 0) {
            cart.shippingPrice = 0;
            cart.totalPrice = 0;
            cart.itemsPrice = 0;
            cart.taxPrice = 0;
        }
        res.json({
            cart,
            totalPrice,
            itemsPrice,
            taxPrice,
            shippingPrice,
            success: true,
        });
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
            cart.quantity = cart.items.reduce((total, item) => total + item.quantity, 0);
            const itemsPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
            const taxPrice = Math.round(itemsPrice * 0.3 * 100) / 100;
            const shippingPrice = calculateShippingPrice(cart.quantity, itemsPrice);
            const totalPrice = itemsPrice + taxPrice + shippingPrice;
            cart.shippingPrice = shippingPrice;
            cart.totalPrice = totalPrice;
            console.log("Cart Quantity:", cart.quantity);
            console.log("Items Price:", itemsPrice);
            console.log("Calculated Shipping Price:", calculateShippingPrice(cart.quantity, itemsPrice));
            // Save updated cart
            await cart.save();
            res.json({
                cart,
                totalPrice,
                itemsPrice,
                taxPrice,
                shippingPrice,
                success: true,
            });
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
    const { size } = req.body; // Accept size as part of the body
    const userId = req.user?._id;
    try {
        const cart = await cartModel_1.Cart.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }
        // Remove the item based on productId and size
        cart.items = cart.items.filter((item) => !(item.product.toString() === productId && item.size === size));
        // Recalculate cart totals
        cart.quantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        const itemsPrice = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        const taxPrice = cart.quantity > 0 ? Math.round(itemsPrice * 0.3 * 100) / 100 : 0;
        const shippingPrice = cart.quantity > 0 ? calculateShippingPrice(cart.quantity, itemsPrice) : 0;
        const totalPrice = itemsPrice + taxPrice + shippingPrice;
        cart.itemsPrice = itemsPrice;
        cart.taxPrice = taxPrice;
        cart.shippingPrice = shippingPrice;
        cart.totalPrice = totalPrice;
        // If the cart is empty, reset everything
        if (cart.quantity === 0) {
            cart.shippingPrice = 0;
            cart.totalPrice = 0;
            cart.itemsPrice = 0;
            cart.taxPrice = 0;
        }
        await cart.save();
        res.json({
            cart,
            totalPrice,
            itemsPrice,
            taxPrice,
            shippingPrice,
            success: true,
            message: "Item removed from cart",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.removeItemFromCart = removeItemFromCart;
//# sourceMappingURL=cartController.js.map