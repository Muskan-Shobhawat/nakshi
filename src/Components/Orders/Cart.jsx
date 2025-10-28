import React, { useEffect, useState } from "react";
import {
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
import "../../CSS/Order/Cart.css";
import DeliveryDetails from "./DeliveryDetails";

export default function Cart() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_APP_BACKEND_URI;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null); // ✅ will come from DeliveryDetails

  const fmtINR = (n) =>
    Number(n ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  // ✅ Fetch Cart
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to view your cart");
        setLoading(false);
        navigate("/");
        return;
      }

      try {
        const res = await fetch(`${API}cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setItems(Array.isArray(data.cart?.items) ? data.cart.items : []);
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

  // ✅ Totals
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  if (loading)
    return (
      <Typography align="center" sx={{ mt: "10vh" }}>
        Loading your cart...
      </Typography>
    );

  if (error)
    return (
      <Typography align="center" color="error" sx={{ mt: "10vh" }}>
        {error}
      </Typography>
    );

  if (!items.length)
    return (
      <div className="empty-cart">
        <Typography variant="h5" gutterBottom>
          Your cart is empty 🛒
        </Typography>
        <Button variant="contained" onClick={() => navigate("/shop")}>
          Shop Now
        </Button>
      </div>
    );

  return (
    <div className="cart-container">
      <Typography className="cart-title" variant="h4">
        My Cart 🛍️
      </Typography>

      <Grid container spacing={4} className="cart-main">
        {/* LEFT SIDE - Cart Items */}
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Paper key={item.productId} className="cart-item">
              <div className="item-info">
                <img src={item.image} alt={item.name} className="item-img" />
                <div>
                  <Typography className="item-name">{item.name}</Typography>
                  <Typography className="item-price">
                    ₹{fmtINR(item.price)}
                  </Typography>
                </div>
              </div>

              <div className="qty-box">
                <IconButton onClick={() => updateQuantity(item.productId, "decrease")}>
                  <RemoveIcon />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton onClick={() => updateQuantity(item.productId, "increase")}>
                  <AddIcon />
                </IconButton>
              </div>

              <IconButton color="error" onClick={() => removeItem(item.productId)}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}

          {/* Delivery Section */}
          <DeliveryDetails onDetailsComplete={setDeliveryInfo} />
        </Grid>

        {/* RIGHT SIDE - Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper className="order-summary">
            <Typography className="summary-title">Order Summary</Typography>
            <Divider className="divider" />

            <Stack spacing={1}>
              <div className="summary-row">
                <Typography>Subtotal:</Typography>
                <Typography>₹{fmtINR(subtotal)}</Typography>
              </div>

              <div className="summary-row">
                <Typography>Shipping (5%):</Typography>
                <Typography>₹{fmtINR(tax)}</Typography>
              </div>

              <Divider className="divider" />

              <div className="summary-total">
                <Typography>Total:</Typography>
                <Typography className="summary-amount">
                  ₹{fmtINR(total)}
                </Typography>
              </div>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* ✅ Fixed Checkout Footer */}
      <Paper
        elevation={6}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#a60019",
          color: "white",
          borderRadius: "12px 12px 0 0",
          zIndex: 1300,
        }}
      >
        <Typography variant="body1" sx={{ fontSize: "2vh" }}>
          Total: ₹{fmtINR(total)}
        </Typography>

        <Button
          variant="contained"
          sx={{
            bgcolor: "white",
            color: "#a60019",
            px: "3vw",
            py: "1vh",
            fontWeight: "bold",
          }}
          disabled={!deliveryInfo?.address}
          onClick={() => alert("Proceeding to checkout...")}
        >
          Proceed to Checkout
        </Button>
      </Paper>
    </div>
  );
}
