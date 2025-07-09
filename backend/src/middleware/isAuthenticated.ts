import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { User, UserSchema } from "../models/userModel";
import ErrorHandler from "../utils/errorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define the AuthenticatedRequest interface
export interface AuthenticatedRequest extends Request {
  user?: UserSchema; // User schema including fields like _id, name, etc.
}

export const isAuthenticated = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
          const token = req.cookies.token;

          if (!token) {
              return next(new ErrorHandler("Token not found", 400));
          }

          const jwtSecret = process.env.JWT_SECRET_KEY || "";
          const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

          if (!decoded || !decoded.userId) {
              return next(new ErrorHandler("Invalid Token or UserId not found", 401));
          }

          // Handle the case when the token is from an admin or regular user
          const userId = decoded.userId;
          const user = await User.findById(userId).select("_id name email");

          if (!user) {
              return next(new ErrorHandler("User not found", 401));
          }

          req.user = user;
          next();
      } catch (error) {
          return next(new ErrorHandler("Invalid Token", 401));
      }
  }
);