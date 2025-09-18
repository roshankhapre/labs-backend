import LabPackage from "../models/labPackageModel.js";

// @desc    Create Lab Package (Admin)
export const createPackage = async (req, res) => {
  const { name, description, originalPrice, discountPercent } = req.body;

  if (![30, 35, 40].includes(discountPercent)) {
    return res
      .status(400)
      .json({ message: "Discount must be 30%, 35%, or 40%" });
  }

  const discountedPrice =
    originalPrice - (originalPrice * discountPercent) / 100;

  try {
    const newPackage = await LabPackage.create({
      name,
      description,
      originalPrice,
      discountPercent,
      discountedPrice,
    });

    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: "Failed to create package", error });
  }
};

// @desc    Get All Packages (only show discounted price if user has paid ₹50)
export const getAllPackages = async (req, res) => {
  try {
    const packages = await LabPackage.find();
    const hasPaid = req.user?.hasPaidInitialFee;

    const result = packages.map((p) => ({
      _id: p._id,
      name: p.name,
      description: p.description,
      price: hasPaid ? p.discountedPrice : p.originalPrice,
      discount: hasPaid ? p.discountPercent : 0,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching packages", error });
  }
};
