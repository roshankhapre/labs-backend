// utils/razorpay.js
import dotenv from "dotenv";
import path from "path";
import Razorpay from "razorpay";

// ✅ Load .env inside this file
dotenv.config({ path: path.resolve("./.env") });

console.log(
  "Initializing Razorpay with:",
  process.env.RAZORPAY_KEY_ID,
  process.env.RAZORPAY_KEY_SECRET
);

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default instance;
