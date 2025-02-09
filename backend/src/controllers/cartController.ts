// import { Request, Response } from "express";
// import { Product } from "../models/productModel";
// import { User } from "../models/userModel";

import { Request, Response } from "express";
import { User, UserSchema } from "../models/userModel";
import { Product, ProductType } from "../models/productModel";
import { Cart } from "../models/cartModel";
import { AuthenticatedRequest, RemoveFromCartRequest, UpdateCartRequest } from "../types/types";
import mongoose from "mongoose";

// export const getUserCart = async (req: Request, res: Response): Promise<void> => {
//     const { userId } = req.body;

//     // Validate input
//     if (!userId) {
//       res.status(400).json({
//         message: "userId is required",
//       });
//       return;
//     }

//     try {
//       // Fetch the user by ID
//       const user = await User.findById(userId);

//       if (!user) {
//         res.status(404).json({
//           message: "User not found",
//         });
//         return;
//       }

//       // Retrieve the cart data
//       const cart = user.cartData;

//       res.status(200).json({
//         message: "Cart retrieved successfully",
//         cart: cart || {},
//       });
//     } catch (error) {
//       console.error("Error retrieving user cart:", error);
//       res.status(500).json({
//         message: "Internal server error",
//       });
//     }
//   };


//   export const addToCart = async (req: Request, res: Response): Promise<void> => {
//     const { userId, itemId, size } = req.body;

//     // Input validation
//     if (!userId || !itemId || !size) {
//       res.status(400).json({
//         message: "userId, itemId, and size are required",
//       });
//       return;
//     }

//     try {
//       // Check if the product exists
//       const product = await Product.findById(itemId);
//       if (!product) {
//         res.status(404).json({ message: "Product not found" });
//         return;
//       }

//       // Validate the size
//       if (!product.sizes.includes(size)) {
//         res.status(400).json({ message: "Invalid size selected" });
//         return;
//       }

//       // Fetch the user
//       const user = await User.findById(userId);
//       if (!user) {
//         res.status(404).json({ message: "User not found" });
//         return;
//       }

//       // Build the cart item object
//       const cartItem = {
//         productId: itemId,
//         size: size,
//         quantity: 1,
//         name: product.name,
//         price: product.price,
//         imageUrl: product.images[0]?.imageUrl || "", // Add a fallback for imageUrl
//       };

//       // Check if the product already exists in the user's cart
//       const existingCartItem = user.cartData[itemId]?.[size];

//       if (existingCartItem) {
//         // Increment quantity if it exists
//         await User.updateOne(
//           { _id: userId },
//           { $inc: { [`cartData.${itemId}.${size}.quantity`]: 1 } }
//         );
//       } else {
//         // Add a new cart item if it doesn't exist
//         await User.updateOne(
//           { _id: userId },
//           { $set: { [`cartData.${itemId}.${size}`]: cartItem } }
//         );
//       }

//       // Fetch the updated user cart
//       const updatedUser = await User.findById(userId);

//       res.status(200).json({
//         message: "Product added to cart successfully",
//         cart: updatedUser?.cartData,
//       });
//     } catch (error) {
//       console.error("Error adding product to cart:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   };

//   export const updateCart = async (req: Request, res: Response): Promise<void> => {
//     const { userId, itemId, size, quantity } = req.body;

//     // Input validation
//     if (!userId || !itemId || !size || typeof quantity !== "number" || quantity < 0) {
//       res.status(400).json({
//         message: "userId, itemId, size, and a valid quantity are required",
//       });
//       return;
//     }

//     try {
//       // Fetch the user
//       const user = await User.findById(userId);
//       if (!user) {
//         res.status(404).json({ message: "User not found" });
//         return;
//       }

//       // Check if the product exists in the user's cart
//       const cartItem = user.cartData[itemId]?.[size];
//       if (!cartItem) {
//         res.status(404).json({ message: "Cart item not found" });
//         return;
//       }

//       if (quantity === 0) {
//         // Remove the cart item if quantity is set to 0
//         await User.updateOne(
//           { _id: userId },
//           { $unset: { [`cartData.${itemId}.${size}`]: "" } }
//         );

//         // Remove the itemId if it has no sizes left
//         const updatedUser = await User.findById(userId);
//         if (updatedUser && Object.keys(updatedUser.cartData[itemId] || {}).length === 0) {
//           await User.updateOne(
//             { _id: userId },
//             { $unset: { [`cartData.${itemId}`]: "" } }
//           );
//         }
//       } else {
//         // Update the quantity if greater than 0
//         await User.updateOne(
//           { _id: userId },
//           { $set: { [`cartData.${itemId}.${size}.quantity`]: quantity } }
//         );
//       }

//       // Fetch the updated user cart
//       const updatedUser = await User.findById(userId);

//       res.status(200).json({
//         message: "Cart updated successfully",
//         cart: updatedUser?.cartData,
//       });
//     } catch (error) {
//       console.error("Error updating cart:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   };


//   export const removeItem = async (req: Request, res: Response): Promise<void> => {
//     const { userId, itemId, size } = req.body;

//     // Input validation
//     if (!userId || !itemId || !size) {
//       res.status(400).json({
//         message: "userId, itemId, and size are required",
//       });
//       return;
//     }

//     try {
//       // Fetch the user
//       const user = await User.findById(userId);
//       if (!user) {
//         res.status(404).json({ message: "User not found" });
//         return;
//       }

//       // Check if the product exists in the user's cart
//       const cartItem = user.cartData[itemId]?.[size];
//       if (!cartItem) {
//         res.status(404).json({ message: "Cart item not found" });
//         return;
//       }

//       // Remove the cart item
//       await User.updateOne(
//         { _id: userId },
//         { $unset: { [`cartData.${itemId}.${size}`]: "" } }
//       );

//       // Remove the itemId if it has no sizes left
//       const updatedUser = await User.findById(userId);
//       if (updatedUser && Object.keys(updatedUser.cartData[itemId] || {}).length === 0) {
//         await User.updateOne(
//           { _id: userId },
//           { $unset: { [`cartData.${itemId}`]: "" } }
//         );
//       }

//       // Fetch the updated user cart
//       const finalUser = await User.findById(userId);

//       res.status(200).json({
//         message: "Item removed from cart successfully",
//         cart: finalUser?.cartData,
//       });
//     } catch (error) {
//       console.error("Error removing item from cart:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   };

// Type for the request body
interface AddToCartRequestBody {
  size: string;
}

// Type for the request params
interface AddToCartRequestParams {
  productId: string;
}

// Custom request type
interface AddToCartRequest {
  body: AddToCartRequestBody; // Body contains 'size'
  params: AddToCartRequestParams; // Params contains 'productId'
  user?: { _id: string }; // Optional user field
}

const calculateShippingPrice = (quantity: number, itemsPrice: number): number => {
  if (itemsPrice >= 5000) return 0; // Free shipping for orders above $500
  if (quantity <= 2) return 150; // $5 for small orders
  if (quantity <= 5) return 250; // $10 for medium orders
  return 15; // $15 for large orders
};

export const addToCart = async (req: AddToCartRequest, res: Response): Promise<void> => {
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
    const user = await User.findById(userId);
    if (!user) {
      console.log("Step 7: User not found");
      res.status(404).json({ message: "User not found" });
      return;
    }

    console.log("Step 8: Looking for product");
    const product = await Product.findById(productId);
    if (!product) {
      console.log("Step 9: Product not found");
      res.status(404).json({ message: "Product not found" });
      return;
    }

    console.log("Step 10: Looking for cart");
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      console.log("Step 11: Creating new cart");
      cart = new Cart({
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
    const productObjectId = new mongoose.Types.ObjectId(productId); // Convert to ObjectId

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId.toString() && item.size === size
    );

    if (existingItem) {
      existingItem.quantity++; // Increment quantity if item already exists
    } else {
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
  } catch (error) {
    console.error("Step 17: Error occurred", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserCart = async (
  req: Request & { user?: { _id: string } },
  res: Response
): Promise<void> => {
  const userId = req.user?._id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCart = async (req: UpdateCartRequest, res: Response): Promise<void> => {
  const { productId } = req.params;
  const { size, quantity } = req.body; // Accept quantity as part of the body
  const userId = req.user?._id;

  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    // Find the specific item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && (!size || item.size === size)
    );

    if (itemIndex !== -1) {
      // Update size if provided
      if (size) cart.items[itemIndex].size = size;

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
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeItemFromCart = async (req: RemoveFromCartRequest, res: Response): Promise<void> => {
  const { productId } = req.params;
  const { size } = req.body; // Accept size as part of the body
  const userId = req.user?._id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    // Remove the item based on productId and size
    cart.items = cart.items.filter(
      (item) => !(item.product.toString() === productId && item.size === size)
    );

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};