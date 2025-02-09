import { NextFunction, Request, Response } from "express";
import { deleteMediaFromCloudinary, uploadMedia } from "../config/cloudinary";
import { Product } from "../models/productModel";

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