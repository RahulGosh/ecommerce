import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const adminToken = req.cookies.adminToken;

    if (!adminToken) {
      res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again.",
      });
      return;
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error("Admin credentials (email or password) are missing in environment variables.");
    }

    const tokenDecode = jwt.verify(adminToken, secretKey) as JwtPayload;
    const expectedPayload = adminEmail + adminPassword;

    console.log(tokenDecode, "tokenDecode")
    console.log(expectedPayload, "expectedPayload")
    console.log(adminEmail, "adminEmail")
    console.log(adminPassword, "adminPassword")
    console.log(adminToken, "token")

    if (tokenDecode.data !== expectedPayload) {
      res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again.",
      });
      return;
    }

    next(); // Proceed if authorized
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
