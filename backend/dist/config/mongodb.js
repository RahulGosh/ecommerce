"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("../server"));
mongoose_1.default.set("strictQuery", false);
const connectDB = async () => {
    mongoose_1.default
        .connect(process.env.MONGODB_URI)
        .then(() => {
        console.log("MongoDB connected");
        server_1.default.listen(process.env.PORT, () => {
            console.log(`Server is running on Port : ${process.env.PORT}`);
        });
    })
        .catch(console.error);
};
exports.connectDB = connectDB;
//# sourceMappingURL=mongodb.js.map