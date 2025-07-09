"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const cartRoute_1 = __importDefault(require("./routes/cartRoute"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
const mongodb_1 = require("./config/mongodb");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
(0, mongodb_1.connectDB)();
app.use(body_parser_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// const corsOptions = [
//     process.env.FRONTEND_URL, // Frontend
//     process.env.ADMIN_URL, // Admin
// ].filter(Boolean); // Remove undefined or null values
const allowedOrigins = [process.env.FRONTEND_URL || `http://localhost:5173`, process.env.ADMIN_URL || 'http://localhost:5174'];
app.use((0, cors_1.default)({
    origin: allowedOrigins, // Specify your frontend URL
    credentials: true, // Enable credentials (cookies, authorization headers)
}));
app.use("/api/v1", userRoute_1.default);
app.use("/api/v1", productRoute_1.default);
app.use("/api/v1", cartRoute_1.default);
app.use("/api/v1", orderRoute_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map