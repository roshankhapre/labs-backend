import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";
import { sendBookingEmail, sendAdminNotification } from "../utils/email.js";

// @desc Public booking (without packages)
export const createPublicBooking = async (req, res) => {
  try {
    console.log("Public booking request received:", req.body);

    const {
      name,
      email,
      phone,
      address,
      appointmentDate,
      appointmentTime,
      paymentInfo,
      amount, // ✅ get from frontend (in INR)
    } = req.body;

    // Create booking
    const booking = new Booking({
      name,
      email,
      phone,
      address,
      appointmentDate,
      appointmentTime,
      paymentInfo: {
        razorpayPaymentId: paymentInfo?.razorpay_payment_id,
        razorpayOrderId: paymentInfo?.razorpay_order_id,
        razorpaySignature: paymentInfo?.razorpay_signature,
      },
      paidAmount: amount || 0, // ✅ store actual amount
      paymentStatus: "Paid",
      status: "Pending",
    });

    await booking.save();

    // Send email to user
    try {
      await sendBookingEmail({
        to: email,
        name,
      });
    } catch (userEmailError) {
      console.error("User email failed:", userEmailError);
    }

    // Send notification to admin
    try {
      await sendAdminNotification({
        name,
        email,
        phone,
      });
    } catch (adminEmailError) {
      console.error("Admin email failed:", adminEmailError);
    }

    res.status(201).json({
      success: true,
      message: "Booking successful",
      booking,
    });
  } catch (error) {
    console.error("Booking failed:", error);
    res.status(400).json({
      success: false,
      message: "Booking failed",
      error,
    });
  }
};

// @desc Get all bookings (for client dashboard)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name email phone");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error });
  }
};
