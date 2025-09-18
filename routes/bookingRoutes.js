import express from "express";
import {
  createPublicBooking,
  getAllBookings,
} from "../controllers/bookingController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/public", createPublicBooking);

router.get("/", protect, adminOnly, getAllBookings); // ✅

export default router;
 