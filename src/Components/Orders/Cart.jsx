import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Divider,
  Paper,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_APP_BACKEND_URI;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch cart items on mount
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to view your cart");
        navigate("/");
        return;
      }

      try {
        const res = await fetch(`${API}cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setItems(data.cart.items || []);
        } else {
          setError(data.message || "Failed to fetch cart");
        }
      } catch (err) {
        console.error("Fetch cart error:", err);
        setError("Something went wrong while loading cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [API, navigate]);

  // ✅ Update quantity
  const updateQuantity = async (productId, action) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      let updatedItems = [...items];

      const itemIndex = updatedItems.findIndex(
        (it) => it.productId._id === productId
      );

      if (itemIndex < 0) return;

      if (action === "increase") {
        updatedItems[itemIndex].quantity += 1;
      } else if (action === "decrease") {
        updatedItems[itemIndex].quantity -= 1;
        if (updatedItems[itemIndex].quantity <= 0) {
          await removeItem(productId);
          return;
        }
      }

      setItems([...updatedItems]);

      // Optional: update backend (future optimization: single API call)
      await fetch(`${API}cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: action === "increase" ? 1 : -1,
        }),
      });
    } catch (err) {
      console.error("Quantity update error:", err);
    }
  };

  // ✅ Remove item
  const removeItem = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      const res = await fetch(`${API}cart/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.cart.items || []);
      } else {
        alert(data.message || "Failed to remove item");
      }
    } catch (err) {
      console.error("Remove item error:", err);
    }
  };

  // ✅ Price Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );
  const tax = subtotal * 0.05; // 5% tax example
  const total = subtotal + tax;

  if (loading)
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        Loading your cart...
      </Typography>
    );

  if (error)
    return (
      <Typography align="center" color="error" sx={{ mt: 5 }}>
        {error}
      </Typography>
    );

  if (!items.length)
    return (
      <Box textAlign="center" sx={{ mt: 10 }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty 🛒
        </Typography>
        <Button variant="contained" onClick={() => navigate("/shop")}>
          Shop Now
        </Button>
      </Box>
    );

  return (
    <Box sx={{ p: "4vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Cart 🛍️
      </Typography>

      <Grid container spacing={4}>
        {/* Left: Cart Items */}
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Paper
              key={item.productId._id}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <img
                  src={item.productId.mainPhoto}
                  alt={item.productId.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.productId.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{item.productId.price.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {/* Quantity Controls */}
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton
                  onClick={() => updateQuantity(item.productId._id, "decrease")}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton
                  onClick={() => updateQuantity(item.productId._id, "increase")}
                >
                  <AddIcon />
                </IconButton>
              </Stack>

              {/* Remove */}
              <IconButton
                color="error"
                onClick={() => removeItem(item.productId._id)}
              >
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Grid>

        {/* Right: Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Subtotal:</Typography>
                <Typography>₹{subtotal.toLocaleString()}</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography>Tax (5%):</Typography>
                <Typography>₹{tax.toFixed(2)}</Typography>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" fontWeight="bold">
                  ₹{total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </Stack>
            </Stack>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              onClick={() => alert("Proceeding to checkout...")}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
