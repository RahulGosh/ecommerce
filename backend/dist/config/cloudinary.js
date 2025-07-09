"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideoFromCloudinary = exports.deleteMediaFromCloudinary = exports.uploadMedia = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({});
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dv0yimv4z",
    api_key: process.env.CLOUDINARY_API_KEY || "275175111542186",
    api_secret: process.env.CLOUDINARY_SECRET_KEY || "JfvERs9TZ8_QRMihGZMz5ME1iyA"
});
const uploadMedia = async (file) => {
    try {
        const uploadResponse = await cloudinary_1.v2.uploader.upload(file, {
            resource_type: "auto",
        });
        return uploadResponse;
    }
    catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null; // Return null in case of an error
    }
};
exports.uploadMedia = uploadMedia;
const deleteMediaFromCloudinary = async (publicId) => {
    try {
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
    catch (error) {
        console.log(error);
    }
};
exports.deleteMediaFromCloudinary = deleteMediaFromCloudinary;
const deleteVideoFromCloudinary = async (publicId) => {
    try {
        await cloudinary_1.v2.uploader.destroy(publicId, { resource_type: "video" });
    }
    catch (error) {
        console.log(error);
    }
};
exports.deleteVideoFromCloudinary = deleteVideoFromCloudinary;
//# sourceMappingURL=cloudinary.js.map