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

const sampleProducts = [
  {
    id: 1,
    name: "Nakshi Bridal Bangle",
    sku: "NK-BNG-001",
    price: 899,
    qty: 2,
    img: "https://via.placeholder.com/100?text=Bangle",
  },
  {
    id: 2,
    name: "Delicate Floral Necklace",
    sku: "NK-NCK-002",
    price: 1299,
    qty: 1,
    img: "https://via.placeholder.com/100?text=Necklace",
  },
  {
    id: 3,
    name: "Traditional Earrings Set",
    sku: "NK-ER-003",
    price: 599,
    qty: 3,
    img: "https://via.placeholder.com/100?text=Earrings",
  },
];

function formatINR(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function Cart() {
  const [items, setItems] = useState(sampleProducts);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountPercent }
  const [snack, setSnack] = useState({ open: false, severity: "info", message: "" });

  const deliveryFee = 49; // flat delivery fee

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return Math.round((appliedCoupon.discountPercent / 100) * subtotal);
  }, [appliedCoupon, subtotal]);

  const total = subtotal - discount + (items.length > 0 ? deliveryFee : 0);

  function showSnack(message, severity = "success") {
    setSnack({ open: true, message, severity });
  }

  const increaseQty = (id) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it)));
  };

  const decreaseQty = (id) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(0, it.qty - 1) } : it))
        .filter((it) => it.qty > 0) // remove if qty becomes 0
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    showSnack("Item removed from cart", "info");
  };

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    // Demo: only one coupon NAKSHI10 => 10% off
    if (!code) {
      showSnack("Enter a coupon code", "warning");
      return;
    }
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

  const handleUpdateCart = () => {
    // in real app you'd sync with server here
    showSnack("Cart updated", "success");
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      showSnack("Your cart is empty", "warning");
      return;
    }
    // navigate to checkout or open checkout modal
    showSnack("Proceeding to checkout...", "success");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0b0b0b", p: { xs: 2, md: 6 } }}>
      <Typography variant="h6" align="center" sx={{ color: "#fff", mb: 3 }}>
        CART PAGE
      </Typography>

      <Paper
        elevation={6}
        sx={{
          borderRadius: 3,
          p: { xs: 2, md: 3 },
          maxWidth: 1200,
          mx: "auto",
        }}
      >
        <Grid container spacing={3}>
          {/* Left Column - Cart Items */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Shopping Cart
            </Typography>

            {items.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography variant="subtitle1">Your cart is empty</Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse our collections and add beautiful pieces to your cart.
                </Typography>
                <Button sx={{ mt: 2 }} variant="contained" onClick={() => showSnack("Go shopping!")}>
                  Continue Shopping
                </Button>
              </Box>
            ) : (
              <Stack spacing={2}>
                {items.map((it) => (
                  <Paper
                    key={it.id}
                    sx={{
                      p: 1.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      borderRadius: 2,
                    }}
                    variant="outlined"
                  >
                    <Avatar
                      src={it.img}
                      alt={it.name}
                      variant="rounded"
                      sx={{ width: 84, height: 84 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600 }}>{it.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {it.sku}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Price: <strong>{formatINR(it.price)}</strong>
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton size="small" onClick={() => decreaseQty(it.id)} aria-label="decrease">
                        <RemoveIcon />
                      </IconButton>
                      <Paper
                        sx={{
                          px: 2,
                          py: 0.5,
                          textAlign: "center",
                          minWidth: 36,
                        }}
                        elevation={1}
                      >
                        <Typography variant="body2">{it.qty}</Typography>
                      </Paper>
                      <IconButton size="small" onClick={() => increaseQty(it.id)} aria-label="increase">
                        <AddIcon />
                      </IconButton>
                    </Box>

                    <Box sx={{ textAlign: "right", ml: 2 }}>
                      <Typography sx={{ fontWeight: 700 }}>{formatINR(it.price * it.qty)}</Typography>
                      <IconButton color="error" onClick={() => removeItem(it.id)} aria-label="remove item">
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
                  <Button variant="contained" onClick={handleUpdateCart}>
                    Update Cart
                  </Button>
                </Stack>
              </Stack>
            )}
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, borderRadius: 2, position: "sticky", top: 24 }} elevation={3}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Order Summary
                  </Typography>
                  <LocalShippingIcon color="action" />
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {formatINR(subtotal)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2">Delivery</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {items.length > 0 ? formatINR(deliveryFee) : formatINR(0)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2">Discount</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    - {formatINR(discount)}
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                    {formatINR(total)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Have a coupon? Use <strong>NAKSHI10</strong> for 10% demo discount.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <Button variant="contained" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </Stack>

                {appliedCoupon && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CheckCircleOutlineIcon color="success" />
                    <Box>
                      <Typography variant="body2">Coupon <strong>{appliedCoupon.code}</strong> applied</Typography>
                      <Button size="small" onClick={handleResetCoupon}>
                        Remove
                      </Button>
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

      {/* snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
