import Cart from "../Models/cart.js";
import Product from "../Models/products.js";

// ✅ ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    // Check product validity
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    // Get or create user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            name: product.name,
            price: product.price,
            quantity,
            image: product.mainPhoto,
          },
        ],
      });
    } else {
      // Check if item already exists
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          productId,
          name: product.name,
          price: product.price,
          quantity,
          image: product.mainPhoto,
        });
      }
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while adding to cart",
    });
  }
};

// ✅ GET USER CART
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res.status(200).json({ success: true, cart: { items: [] } });

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (err) {
    console.error("GET CART ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching cart",
    });
  }
};

// ✅ REMOVE ITEM FROM CART
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res.status(404).json({ success: false, message: "Cart not found" });

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    if (cart.items.length === initialLength)
      return res.status(404).json({ success: false, message: "Item not found in cart" });

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed successfully",
      cart,
    });
  } catch (err) {
    console.error("REMOVE FROM CART ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while removing item",
    });
  }
};

// ✅ CLEAR ENTIRE CART (optional)
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart)
      return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (err) {
    console.error("CLEAR CART ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while clearing cart",
    });
  }
};
