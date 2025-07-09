import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv"
dotenv.config({})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dn982bksw",
    api_key: process.env.CLOUDINARY_API_KEY || "213883857442458",
    api_secret: process.env.CLOUDINARY_SECRET_KEY || "cMWyH4KoFqGsk2tI8NDI0mfeFQQ"
})

export const uploadMedia = async (file: string): Promise<UploadApiResponse | null> => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
        });
        return uploadResponse;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null; // Return null in case of an error
    }
};

export const deleteMediaFromCloudinary = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.log(error)
    }
}

export const deleteVideoFromCloudinary = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" })
    } catch (error) {
        console.log(error)
    }
}