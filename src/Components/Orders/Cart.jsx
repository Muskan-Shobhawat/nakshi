// src/components/Cart.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Button,
  Divider,
  Stack,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import "../../CSS/Order/Cart.css"; // <-- CSS file imported

const sampleProducts = [
  { id: 1, name: "Nakshi Bridal Bangle", sku: "NK-BNG-001", price: 899, qty: 2, img: "https://via.placeholder.com/100?text=Bangle" },
  { id: 2, name: "Delicate Floral Necklace", sku: "NK-NCK-002", price: 1299, qty: 1, img: "https://via.placeholder.com/100?text=Necklace" },
  { id: 3, name: "Traditional Earrings Set", sku: "NK-ER-003", price: 599, qty: 3, img: "https://via.placeholder.com/100?text=Earrings" },
];

function formatINR(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function Cart() {
  const [items, setItems] = useState(sampleProducts);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [snack, setSnack] = useState({ open: false, severity: "info", message: "" });

  const deliveryFee = 49;
  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);
  const discount = useMemo(() => !appliedCoupon ? 0 : Math.round((appliedCoupon.discountPercent / 100) * subtotal), [appliedCoupon, subtotal]);
  const total = subtotal - discount + (items.length > 0 ? deliveryFee : 0);

  const showSnack = (msg, severity = "success") => setSnack({ open: true, message: msg, severity });

  const increaseQty = (id) => setItems((p) => p.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it)));
  const decreaseQty = (id) =>
    setItems((p) =>
      p
        .map((it) => (it.id === id ? { ...it, qty: Math.max(0, it.qty - 1) } : it))
        .filter((it) => it.qty > 0)
    );
  const removeItem = (id) => {
    setItems((p) => p.filter((it) => it.id !== id));
    showSnack("Item removed from cart", "info");
  };

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return showSnack("Enter a coupon code", "warning");
    if (code === "NAKSHI10") {
      setAppliedCoupon({ code, discountPercent: 10 });
      showSnack("Coupon applied: 10% off");
    } else {
      setAppliedCoupon(null);
      showSnack("Invalid coupon", "error");
    }
  };

  const handleResetCoupon = () => {
    setCoupon("");
    setAppliedCoupon(null);
    showSnack("Coupon cleared", "info");
  };

  const handleCheckout = () => {
    if (items.length === 0) return showSnack("Your cart is empty", "warning");
    showSnack("Proceeding to checkout...");
  };

  return (
    <Box className="cart-container">
      <Typography variant="h6" align="center" className="cart-title">
        CART PAGE
      </Typography>

      <Paper elevation={6} className="cart-main">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" className="cart-heading">
              Shopping Cart
            </Typography>

            {items.length === 0 ? (
              <Box className="empty-cart">
                <Typography variant="subtitle1">Your cart is empty</Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse our collections and add beautiful pieces to your cart.
                </Typography>
                <Button variant="contained" onClick={() => showSnack("Go shopping!")}>
                  Continue Shopping
                </Button>
              </Box>
            ) : (
              <Stack spacing={2}>
                {items.map((it) => (
                  <Paper key={it.id} variant="outlined" className="cart-item">
                    <Avatar src={it.img} alt={it.name} variant="rounded" className="item-img" />
                    <Box className="item-info">
                      <Typography className="item-name">{it.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {it.sku}
                      </Typography>
                      <Typography variant="body2" className="item-price">
                        Price: <strong>{formatINR(it.price)}</strong>
                      </Typography>
                    </Box>

                    <Box className="qty-box">
                      <IconButton size="small" onClick={() => decreaseQty(it.id)}>
                        <RemoveIcon />
                      </IconButton>
                      <Paper className="qty-paper" elevation={1}>
                        <Typography variant="body2">{it.qty}</Typography>
                      </Paper>
                      <IconButton size="small" onClick={() => increaseQty(it.id)}>
                        <AddIcon />
                      </IconButton>
                    </Box>

                    <Box className="item-total">
                      <Typography className="item-total-price">{formatINR(it.price * it.qty)}</Typography>
                      <IconButton color="error" onClick={() => removeItem(it.id)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}

                <Divider />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between">
                  <Button variant="outlined" onClick={() => { setItems(sampleProducts); showSnack("Cart reset demo"); }}>
                    Reset Demo Cart
                  </Button>
                  <Button variant="contained" onClick={() => showSnack("Cart updated")}>
                    Update Cart
                  </Button>
                </Stack>
              </Stack>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="order-summary" elevation={3}>
              <Stack spacing={2}>
                <Box className="summary-header">
                  <Typography variant="h6" className="summary-title">
                    Order Summary
                  </Typography>
                  <LocalShippingIcon color="action" />
                </Box>

                <Divider />
                <Box><Typography>Subtotal</Typography><Typography>{formatINR(subtotal)}</Typography></Box>
                <Box><Typography>Delivery</Typography><Typography>{formatINR(items.length > 0 ? 49 : 0)}</Typography></Box>
                <Box><Typography>Discount</Typography><Typography>- {formatINR(discount)}</Typography></Box>
                <Divider />

                <Box className="summary-total">
                  <Typography>Total</Typography>
                  <Typography className="summary-amount">{formatINR(total)}</Typography>
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Have a coupon? Use <strong>NAKSHI10</strong> for 10% demo discount.
                </Typography>

                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <Button variant="contained" onClick={handleApplyCoupon}>Apply</Button>
                </Stack>

                {appliedCoupon && (
                  <Paper variant="outlined" className="coupon-paper">
                    <CheckCircleOutlineIcon color="success" />
                    <Box>
                      <Typography variant="body2">Coupon <strong>{appliedCoupon.code}</strong> applied</Typography>
                      <Button size="small" onClick={handleResetCoupon}>Remove</Button>
                    </Box>
                  </Paper>
                )}

                <Button variant="contained" size="large" onClick={handleCheckout} fullWidth>
                  Checkout Now
                </Button>

                <Typography variant="caption" color="text.secondary">
                  90-day limited warranty against manufacturer defects.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
