"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusForCOD = exports.updateStatus = exports.getAllOrders = exports.getUserOrders = exports.stripeWebhook = exports.placeOrderWithStripe = exports.placeOrder = void 0;
const orderModel_1 = require("../models/orderModel");
const userModel_1 = require("../models/userModel");
const cartModel_1 = require("../models/cartModel");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const calculateShippingPrice = (quantity, itemsPrice) => {
    if (itemsPrice >= 5000)
        return 0; // Free shipping for orders above $500
    if (quantity <= 2)
        return 150; // $5 for small orders
    if (quantity <= 5)
        return 250; // $10 for medium orders
    return 15; // $15 for large orders
};
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
        cart.quantity = cart.items.reduce((total, item) => total + item.quantity, 0);
        const itemsPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        const taxPrice = Math.round(itemsPrice * 0.3 * 100) / 100;
        const shippingPrice = calculateShippingPrice(cart.quantity, itemsPrice);
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
            paymentStatus: "Unpaid", // Default payment status
            shippingStatus: "Order Placed", // Default status
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
const placeOrderWithStripe = async (req, res) => {
    try {
        console.log("Received request to place order with Stripe");
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
        cart.quantity = cart.items.reduce((total, item) => total + item.quantity, 0);
        const itemsPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        const taxPrice = Math.round(itemsPrice * 0.3 * 100) / 100;
        const shippingPrice = calculateShippingPrice(cart.quantity, itemsPrice);
        const totalPrice = itemsPrice + taxPrice + shippingPrice;
        // Step 1: Create order in database with "Pending Payment" status
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
            paymentMethod: "Stripe",
            paymentStatus: "Unpaid",
            shippingStatus: "Order Placed",
        });
        // Convert total price to cents for Stripe
        const totalPriceInCents = Math.round(totalPrice * 100);
        // Step 2: Create Stripe Checkout Session with orderId in metadata
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Order Payment",
                        },
                        unit_amount: totalPriceInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/order-failed`,
            metadata: {
                userId: userId.toString(),
                orderId: order.id.toString(), // Convert _id to a string
            },
        }); // Cast the params to the correct type
        // Step 3: Clear the user's cart after creating the order
        cart.items = [];
        cart.totalPrice = 0;
        cart.quantity = 0;
        await cart.save();
        // Return Stripe session URL for payment
        res.status(200).json({ success: true, url: session.url });
    }
    catch (error) {
        console.error("Stripe Checkout Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the checkout session.",
            error: error instanceof Error ? error.message : error,
        });
    }
};
exports.placeOrderWithStripe = placeOrderWithStripe;
const stripeWebhook = async (req, res) => {
    console.log("Stripe Webhook API called");
    let event;
    try {
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
        if (!secret) {
            throw new Error("Webhook secret not found");
        }
        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });
        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    }
    catch (error) {
        console.error("⚠️ Webhook signature verification failed:", error.message);
        res.status(400).send(`Webhook Error: ${error.message}`);
        return;
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Retrieve orderId from metadata
        const orderId = session.metadata?.orderId;
        if (!orderId) {
            console.error('No order ID found in metadata');
            res.status(400).send('Order ID missing in metadata');
            return;
        }
        try {
            const order = await orderModel_1.Order.findById(orderId);
            if (!order) {
                res.status(404).send('Order not found');
                return;
            }
            // Step 4: Update order status after successful payment
            order.paymentStatus = "Paid";
            order.paidAt = new Date();
            order.shippingStatus = "Order Placed"; // Update status
            await order.save();
            console.log(`Order ${orderId} successfully updated after Stripe payment`);
            res.status(200).send('Success');
        }
        catch (error) {
            console.error('Error updating order:', error);
            res.status(500).send('Error processing the order');
        }
    }
    else {
        res.status(200).send('Event received');
    }
};
exports.stripeWebhook = stripeWebhook;
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
        const { orderId, shippingStatus } = req.body;
        await orderModel_1.Order.findByIdAndUpdate(orderId, { shippingStatus });
        res.json({ success: true, message: "Status Updated" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
};
exports.updateStatus = updateStatus;
const updateStatusForCOD = async (req, res) => {
    try {
        const { orderId, paymentStatus } = req.body;
        // Find the order by orderId
        const order = await orderModel_1.Order.findById(orderId);
        // Check if the order exists and if the payment method is COD
        if (!order) {
            res.status(404).json({ success: false, message: "Order not found" });
            return;
        }
        if (order.paymentMethod !== "COD") {
            res.status(400).json({ success: false, message: "This order is not a COD order" });
            return;
        }
        // Update the payment status (Paid or Unpaid)
        order.paymentStatus = paymentStatus;
        // Update the shipping status to 'Delivered' when paymentStatus is set to 'Paid'
        if (paymentStatus === "Paid") {
            order.shippingStatus = "Delivered";
        }
        // Save the updated order
        await order.save();
        res.json({ success: true, message: "Order status updated", order });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating order status", error: error });
    }
};
exports.updateStatusForCOD = updateStatusForCOD;
//# sourceMappingURL=orderController.js.map