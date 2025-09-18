import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import labPackageRoutes from "./routes/labPackageRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config({ path: path.resolve("./.env") });

// DB
connectDB();

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/packages", labPackageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("Lab Booking API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
