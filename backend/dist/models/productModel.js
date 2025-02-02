"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define the schema
const productSchema = new mongoose_1.default.Schema({
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
            imageUrl: { type: String, required: true }, // Cloudinary image URL
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
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});
// Export the Product model
exports.Product = mongoose_1.default.model("Product", productSchema);
//# sourceMappingURL=productModel.js.map