import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }: { email: string; subject: string; message: string }) => {
  const transporter = nodemailer.createTransport({
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

export default sendEmail;
