import express from "express";
import {
  createPackage,
  getAllPackages,
} from "../controllers/labPackageController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createPackage); // Admin only
router.get("/", protect, getAllPackages); // User must be logged in

export default router;
