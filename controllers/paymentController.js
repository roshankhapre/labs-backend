import crypto from "crypto";
import Razorpay from "../utils/razorpay.js";
import User from "../models/userModel.js";

// @desc Create Razorpay Order for ₹50
export const createPaymentOrder = async (req, res) => {
  const options = {
    amount: 50 * 100, // ₹50 in paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await Razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // ✅ add key for frontend
    });
  } catch (error) {
    res.status(500).json({ message: "Razorpay order failed", error });
  }
};
// @desc Verify Payment Signature and Update User
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    // If valid, return success
    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({
      success: false,
      message: "Server error during payment verification",
    });
  }
};
