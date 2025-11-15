// controllers/products.js
import Product from "../Models/products.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get products (supports category, subcategory, occasion, gender, new, since, q, limit, skip)
export const getProducts = async (req, res) => {
  try {
    const { category, subcategory, occasion, gender, new: isNew, since, limit, skip, q } = req.query;

    const filter = {};

    // Category / Subcategory / Occasion / Gender filters
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (occasion) filter.occasion = occasion;
    if (gender) filter.gender = gender;

    // New arrivals (last 14 days)
    if (isNew === "true") {
      const days = 14;
      const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: dateFrom };
    }

    // Custom date filter (since)
    if (since) {
      const dateFrom = new Date(since);
      if (!isNaN(dateFrom)) {
        filter.createdAt = { $gte: dateFrom };
      }
    }

    // Simple text search (requires text index on Product collection)
    if (q) {
      filter.$text = { $search: q };
    }

    // Pagination
    const qLimit = Math.min(parseInt(limit || "48", 10), 200);
    const qSkip = Math.max(parseInt(skip || "0", 10), 0);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(qSkip)
        .limit(qLimit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({ success: true, total, products });
  } catch (error) {
    console.error("getProducts error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
