import { NextFunction, Request, Response } from "express";
import { deleteMediaFromCloudinary, uploadMedia } from "../config/cloudinary";
import { Product, ProductType } from "../models/productModel";
import mongoose from "mongoose";

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, price, category, subCategory, sizes, bestSeller, date } = req.body;

    // Handle uploaded files
    const files = req.files as Express.Multer.File[]; // Array of uploaded files
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: "Images are required" });
      return;
    }

    // Upload images to cloud (or use the local file path)
    const imagesData: { publicId: string; imageUrl: string }[] = [];
    for (const file of files) {
      const uploadedMedia = await uploadMedia(file.path);
      if (uploadedMedia && uploadedMedia.secure_url && uploadedMedia.public_id) {
        imagesData.push({
          publicId: uploadedMedia.public_id, // Cloudinary publicId
          imageUrl: uploadedMedia.secure_url, // Cloudinary secure URL
        });
      } else {
        console.error("Failed to upload file:", file.path);
        res.status(500).json({ success: false, message: "Failed to upload one or more images" });
        return;
      }
    }

    // Convert sizes to an array, ensuring it's a string before using split()
    const sizesArray = Array.isArray(sizes) ? sizes : (typeof sizes === "string" ? sizes.split(",") : []);

    // Ensure bestSeller is a boolean value
    const isBestSeller = bestSeller === "true" || bestSeller === true;

    // Create the product
    const product = await Product.create({
      name,
      description,
      price,
      images: imagesData, // Store the array of image objects
      category,
      subCategory,
      sizes: sizesArray, // Store the sizes as an array
      bestSeller: isBestSeller, // Set the bestSeller flag
      date: Date.now(),
    });

    res.status(201).json({ success: true, product, message: "Product Added Successfully!" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add product" });
  }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find({});

        if (!products || products.length === 0) {
            res.status(404).json({
                products: [],
                message: "Products not found",
            });
            return;
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
};

export const latestProductsCollection = async (req: Request, res: Response) => {
  try {
    const latestProducts = await Product.find()
      .sort({ date: -1 }) 
      .limit(8);

    res.status(200).json({ success: true, products: latestProducts });
  } catch (error) {
    console.error("Error fetching latest products:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const removeProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productId } = req.body;
  
      if (!productId) {
        res.status(400).json({
          success: false,
          message: "Product ID is required",
        });
        return;
      }
  
      const product = await Product.findByIdAndDelete(productId);
      if (!product) {
        res.status(404).json({
          success: false,
          message: "Product not found!",
        });
        return;
      }
  
      // Delete images from Cloudinary
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          await deleteMediaFromCloudinary(image.publicId); // Use publicId to delete the image from Cloudinary
        }
      }
  
      res.status(200).json({
        success: true,
        message: "Product removed successfully",
      });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to remove product",
      });
    }
  };

  export const singleProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const product = await Product.findById(productId)
      if (!product) {
        res.status(404).json({
          message: "Product not found!"
        });
        return;
      }
      res.status(200).json({
        product
      });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Failed to get product by id"
      })
      return;
    }
  }

  export const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { productId } = req.params;
      const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;
      const files = req.files as Express.Multer.File[];
  
      // Validate product ID
      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400).json({ success: false, message: "Invalid product ID" });
        return;
      }
  
      // Find the existing product
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }
  
      // Prepare update data with existing values as fallback
      const updateData: Partial<ProductType> = {
        name: name || existingProduct.name,
        description: description || existingProduct.description,
        price: existingProduct.price, // Default to existing, will update if provided
        category: category || existingProduct.category,
        subCategory: subCategory || existingProduct.subCategory,
        sizes: existingProduct.sizes, // Default to existing, will update if provided
        bestSeller: existingProduct.bestSeller, // Default to existing, will update if provided
      };
  
      // Update price if provided and valid
      if (price !== undefined) {
        const priceNumber = Number(price);
        if (isNaN(priceNumber)) {
          res.status(400).json({ success: false, message: "Price must be a valid number" });
          return;
        }
        updateData.price = priceNumber;
      }
  
      // Update sizes if provided
      if (sizes !== undefined) {
        updateData.sizes = Array.isArray(sizes) ? sizes : (typeof sizes === "string" ? sizes.split(",") : []);
      }
  
      // Update bestSeller if provided
      if (bestSeller !== undefined) {
        updateData.bestSeller = bestSeller === "true" || bestSeller === true;
      }
  
      // Handle image updates if new files are uploaded
      if (files && files.length > 0) {
        const imagesData: { publicId: string; imageUrl: string }[] = [];
  
        // Upload new images
        for (const file of files) {
          const uploadedMedia = await uploadMedia(file.path);
          if (uploadedMedia && uploadedMedia.secure_url && uploadedMedia.public_id) {
            imagesData.push({
              publicId: uploadedMedia.public_id,
              imageUrl: uploadedMedia.secure_url,
            });
          } else {
            console.error("Failed to upload file:", file.path);
            res.status(500).json({ success: false, message: "Failed to upload one or more images" });
            return;
          }
        }
  
        // Delete old images from Cloudinary if they exist
        if (existingProduct.images && existingProduct.images.length > 0) {
          for (const image of existingProduct.images) {
            try {
              await deleteMediaFromCloudinary(image.publicId);
            } catch (error) {
              console.error("Failed to delete image from Cloudinary:", error);
              // Continue with update even if image deletion fails
            }
          }
        }
  
        // Set new images
        updateData.images = imagesData;
      } else {
        // Keep existing images if no new ones are uploaded
        updateData.images = existingProduct.images;
      }
  
      // Update the product
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true, runValidators: true }
      );
  
      if (!updatedProduct) {
        res.status(500).json({ success: false, message: "Failed to update product" });
        return;
      }
  
      res.status(200).json({ 
        success: true, 
        product: updatedProduct, 
        message: "Product updated successfully!" 
      });
    } catch (error) {
      console.error("Error updating product:", error);
      
      // Handle Mongoose validation errors
      if (error instanceof mongoose.Error.ValidationError) {
        const messages = Object.values(error.errors).map(err => err.message);
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: messages 
        });
        return;
      }
  
      // Handle duplicate key errors
      if (error) {
        res.status(400).json({ 
          success: false, 
          message: "Product with this name already exists" 
        });
        return;
      }
  
      res.status(500).json({ 
        success: false, 
        message: "Internal server error while updating product" 
      });
    }
  };