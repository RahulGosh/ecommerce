import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the Product document
export interface ProductType extends Document {
  name: string;
  description: string;
  price: number;
  images: { publicId: string; imageUrl: string }[];
  category: string;
  subCategory: string;
  sizes: string[]; // Assuming sizes are stored as strings (e.g., "S", "M", "L")
  bestSeller: boolean;
  date: Date;
}

// Define the schema
const productSchema: Schema<ProductType> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [
      {
        publicId: { type: String, required: true }, // Cloudinary publicId for each image
        imageUrl: { type: String, required: true },  // Cloudinary image URL
      },
    ],
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    sizes: {
      type: [String], // Array of strings for sizes
      required: true,
    },
    bestSeller: {
      type: Boolean,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now, // Automatically sets the current date if no date is provided
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Export the Product model
export const Product: Model<ProductType> = mongoose.model<ProductType>("Product", productSchema);