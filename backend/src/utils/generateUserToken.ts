import jwt from "jsonwebtoken";
import { Response } from "express";
import { UserSchema } from "../models/userModel";

export const generateUserToken = (
    res: Response,
    user: UserSchema,
    userId: string,
    message: string,
    statusCode: number = 200
) => {
    const jwtSecret = process.env.JWT_SECRET_KEY || "";

    // Generate token
    const token = jwt.sign({ userId }, jwtSecret);

    console.log(token, "token backend");

    // Set cookie and send response
    res.status(statusCode)
        .cookie("token", token, {
            httpOnly: true,
            // secure: isProduction,
            secure: true, // Only use secure in production
            // sameSite: isProduction ? 'none' : 'lax',
            sameSite: "none",
            maxAge: 15 * 60 * 1000,
            path: '/'
        })
        .json({
            success: true,
            message,
            userId,
            user,
        });
};