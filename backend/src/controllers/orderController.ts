import { RequestHandler, Response } from "express";
import { IOrder, Order } from "../models/orderModel";
import {
  AuthenticatedRequest,
  CreateCourseCustomRequest,
  PlaceOrderRequest,
} from "../types/types";
import { User } from "../models/userModel";
import { Cart } from "../models/cartModel";
import Stripe from "stripe";
import { emitOrderUpdate } from "../config/socket";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const calculateShippingPrice = (
  quantity: number,
  itemsPrice: number
): number => {
  if (itemsPrice >= 5000) return 0;
  if (quantity <= 2) return 150;
  if (quantity <= 5) return 250;
  return 15;
};

export const placeOrder = async (
  req: PlaceOrderRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {  
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const existingShippingDetail = user.shippingDetail;
    if (!existingShippingDetail) {
      res.status(400).json({
        message: "Shipping details are missing. Please provide shipping details.",
      });
      return;
    }

    cart.quantity = cart.items.reduce((total, item) => total + item.quantity, 0);
    const itemsPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const taxPrice = Math.round(itemsPrice * 0.3 * 100) / 100;
    const shippingPrice = calculateShippingPrice(cart.quantity, itemsPrice);
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // Generate a random session ID for COD orders
    const generateRandomSessionId = () => {
      const prefix = 'cod_';
      const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = prefix;
      for (let i = 0; i < 16; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
      return result;
    };

    const order = await Order.create({
      user: userId,
      orderItems: cart.items.map((item: any) => ({
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
      paymentStatus: "Unpaid",
      shippingStatus: "Order Placed",
      stripeSessionId: generateRandomSessionId(), // Add random session ID for COD
    });

    emitOrderUpdate(order);
    console.log(order, "order successfull")
    cart.items = [];
    cart.totalPrice = 0;
    cart.quantity = 0;
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error });
  }
};

export interface PlaceOrderWithStripeRequest {
  user?: { _id: string };
}

export const placeOrderWithStripe = async (
  req: PlaceOrderRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("Received request to place order with Stripe");

    if (!req.user || !req.user._id) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const existingShippingDetail = user.shippingDetail;
    if (!existingShippingDetail) {
      res.status(400).json({
        message: "Shipping details are missing. Please provide shipping details.",
      });
      return;
    }

    cart.quantity = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const itemsPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const taxPrice = Math.round(itemsPrice * 0.3 * 100) / 100;
    const shippingPrice = calculateShippingPrice(cart.quantity, itemsPrice);
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    const totalPriceInCents = Math.round(totalPrice * 100);

    // First create the order without the session ID
    const order = await Order.create({
      user: userId,
      orderItems: cart.items.map((item: any) => ({
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

    // Then create the Stripe session with the order ID
    const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
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
        orderId: order.id.toString(),
      },
    });

    // Update the order with the session ID
    order.stripeSessionId = session.id;
    await order.save();

    emitOrderUpdate(order);

    cart.items = [];
    cart.totalPrice = 0;
    cart.quantity = 0;
    await cart.save();

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the checkout session.",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export interface StripeWebhookRequest {
  body: {
    user?: { _id: string };
  };
}

export const stripeWebhook = async (
  req: StripeWebhookRequest,
  res: Response
): Promise<void> => {
  console.log("Stripe Webhook API called");

  let event: Stripe.Event;

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
  } catch (error: any) {
    console.error("⚠️ Webhook signature verification failed:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.orderId;
    if (!orderId) {
      console.error("No order ID found in metadata");
      res.status(400).send("Order ID missing in metadata");
      return;
    }

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        res.status(404).send("Order not found");
        return;
      }

      order.paymentStatus = "Paid";
      order.paidAt = new Date();
      order.shippingStatus = "Order Placed";
      await order.save();

      emitOrderUpdate(order);

      console.log(`Order ${orderId} successfully updated after Stripe payment`);

      res.status(200).send("Success");
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).send("Error processing the order");
    }
  } else {
    res.status(200).send("Event received");
  }
};

export interface AddToCartRequest {
  user?: { _id: string };
}

export const getUserOrders = async (
  req: AddToCartRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as AddToCartRequest).user?._id;

    const order = await Order.find({ user: userId });

    if (!order) {
      res
        .status(404)
        .json({ message: "Order not found or does not belong to the user" });
      return;
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error });
  }
};

export interface GetAllOrderRequest {
  user?: {
    _id: string;
    isAdmin: boolean;
  };
}

export const getAllOrders = async (
  req: GetAllOrderRequest,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find({}).populate("user", "name email");

    if (!orders || orders.length === 0) {
      res.status(404).json({ message: "No orders found" });
      return;
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error });
  }
};

interface UpdateStatusRequestBody {
  body: {
    orderId: string;
    shippingStatus: string;
  };
}

export const updateStatus = async (
  req: UpdateStatusRequestBody,
  res: Response
): Promise<void> => {
  try {
    const { orderId, shippingStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId, 
      { shippingStatus },
      { new: true }
    );

    if (!order) {
       res.status(404).json({ success: false, message: "Order not found" });
       return;
    }

    // Emit the updated order via Socket.io
    emitOrderUpdate(order);

    res.json({ success: true, message: "Status Updated", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
};

interface UpdateStatusForCODRequestBody {
  body: {
    orderId: string;
    paymentStatus: string;
  };
}

export const updateStatusForCOD = async (
  req: UpdateStatusForCODRequestBody,
  res: Response
): Promise<void> => {
  try {
    const { orderId, paymentStatus } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    if (order.paymentMethod !== "COD") {
      res
        .status(400)
        .json({ success: false, message: "This order is not a COD order" });
      return;
    }

    order.paymentStatus = paymentStatus;

    if (paymentStatus === "Paid") {
      order.shippingStatus = "Delivered";
    }

    await order.save();

    emitOrderUpdate(order);

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating order status",
        error: error,
      });
  }
};

export interface GetSingleOrderRequest {
  user?: { _id: string };
  params: {
    id: string;
  };
}

export const getSingleUserOrder = async (
  req: GetSingleOrderRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const orderId = req.params.id;

    if (!orderId) {
      res.status(400).json({ message: "Order ID is required" });
      return;
    }

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      res.status(404).json({ message: "Order not found or does not belong to the user" });
      return;
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error", error: error });
  }
};

export interface VerifyStripeSessionRequest {
  user?: { _id: string };
  query: {
    session_id: string;
  };
}

export const getOrderBySessionId = async (
  req: VerifyStripeSessionRequest,
  res: Response
): Promise<void> => {
  try {
    const { session_id } = req.query;
    const userId = req.user?._id;

    if (!session_id) {
      res.status(400).json({ success: false, message: "Session ID is required" });
      return;
    }

    const order = await Order.findOne({
      stripeSessionId: session_id,
      user: userId
    });

    if (!order) {
      res.status(404).json({ 
        success: false, 
        message: "Order not found for this session" 
      });
      return;
    }

    // Special handling for COD orders
    if (order.paymentMethod === "COD" && session_id.startsWith('cod_')) {
       res.status(200).json({ 
        success: true, 
        order,
        isCOD: true,
        message: "This is a COD order" 
      });
      return;
    }

    res.status(200).json({ 
      success: true, 
      order
    });
  } catch (error) {
    console.error("Error fetching order by session ID:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching order",
      error: error instanceof Error ? error.message : error
    });
  }
};