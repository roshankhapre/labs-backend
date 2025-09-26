import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // ✅ ADD BOOKING ID FIELD
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    name: String,
    email: String,
    phone: String,
    address: String,

    appointmentDate: String,
    appointmentTime: String,

    paymentInfo: {
      razorpayPaymentId: String,
      razorpayOrderId: String,
      razorpaySignature: String,
    },

    paidAmount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
