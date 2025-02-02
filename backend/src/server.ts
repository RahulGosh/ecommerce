import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"
import user from "./routes/userRoute"
import product from "./routes/productRoute"
import cart from "./routes/cartRoute"
import order from "./routes/orderRoute"
import { connectDB } from "./config/mongodb";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
connectDB();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cookieParser());

// const corsOptions = [
//     process.env.FRONTEND_URL, // Frontend
//     process.env.ADMIN_URL, // Admin
// ].filter(Boolean); // Remove undefined or null values


const allowedOrigins = [process.env.FRONTEND_URL || `http://localhost:5173`, process.env.ADMIN_URL || 'http://localhost:5174'];

app.use(
  cors({
    origin: allowedOrigins, // Specify your frontend URL
    credentials: true,      // Enable credentials (cookies, authorization headers)
  })
);

app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", cart);
app.use("/api/v1", order);

export default app;