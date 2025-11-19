import Order from "../Models/order.js";
import { storage } from "../..//src/Components/Firebase/Firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const createOrder = async (req, res) => {
  try {
    const screenshotFile = req.file; // multer file buffer
    const meta = JSON.parse(req.body.meta);

    if (!screenshotFile) {
      return res.status(400).json({ success: false, message: "Screenshot required" });
    }

    // Generate Firebase storage path
    const filename = `orders/${Date.now()}-${screenshotFile.originalname}`;
    const storageRef = ref(storage, filename);

    // Upload buffer to Firebase Storage
    await uploadBytes(storageRef, screenshotFile.buffer, {
      contentType: screenshotFile.mimetype
    });

    // Get download URL
    const screenshotURL = await getDownloadURL(storageRef);

    // Save order to MongoDB
    const order = new Order({
      ...meta,
      screenshot: screenshotURL
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order
    });

  } catch (err) {
    console.error("Order Creation Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error creating order",
      error: err.message
    });
  }
};
