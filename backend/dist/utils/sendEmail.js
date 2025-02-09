"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async ({ email, subject, message }) => {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.EMAIL_SECURE === "true", // false for port 587, true for port 465
        auth: {
            user: process.env.SMTP_USER, // Your Gmail email
            pass: process.env.SMTP_PASS, // Your 16-character Gmail App password
        },
        tls: {
            rejectUnauthorized: false, // Fixes potential SSL issues
        },
    });
    await transporter.sendMail({
        from: `"Universe Ecommerce" <${process.env.SMTP_USER}>`,
        to: email,
        subject: subject,
        html: message,
    });
    console.log("Email sent successfully!");
};
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map