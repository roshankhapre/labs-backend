import mongoose from "mongoose";

const labPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    originalPrice: {
      type: Number,
      required: true,
    },
    discountPercent: {
      type: Number,
      required: true,
      enum: [30, 35, 40], // add more if needed
    },
    discountedPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("LabPackage", labPackageSchema);
