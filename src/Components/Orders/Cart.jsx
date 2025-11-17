// src/components/Checkout/Checkout.jsx
import React, { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import {
  Typography,
  Grid,
  Button,
  IconButton,
  Divider,
  Paper,
  Stack,
  Slide,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BlockIcon from "@mui/icons-material/Block";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../CSS/Order/DeliveryDetails.css";
import "../../CSS/Order/Cart.css";

export default function Checkout() {
  const API = import.meta.env.VITE_APP_BACKEND_URI;
  const navigate = useNavigate();

  // delivery state
  const [user, setUser] = useState({ name: "", phone: "" });
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isAddressFilled, setIsAddressFilled] = useState(false);

  // cart state (kept same logic)
  const [items, setItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState("");

  // helper: format INR
  const fmtINR = (n) =>
    Number(n ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  // fetch cart and user (on mount)
  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // fetch cart
        const cartRes = await fetch(`${API}cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = await cartRes.json();
        if (cartRes.ok && cartData.success) {
          setItems(Array.isArray(cartData.cart?.items) ? cartData.cart.items : []);
          if (cartData.cart?.userId) sessionStorage.setItem("cartUserId", cartData.cart.userId);
        } else {
          setCartError(cartData.message || "Failed to fetch cart");
        }

        // attempt to fetch user info
        const userId = sessionStorage.getItem("cartUserId");
        if (userId) {
          const userRes = await fetch(`${API}user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = await userRes.json();
          if (userRes.ok && userData.success) {
            setUser({
              name: userData.user?.name || "",
              phone: userData.user?.phone || "",
            });
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setCartError("Something went wrong while loading cart.");
      } finally {
        setLoadingCart(false);
      }
    };

    fetchAll();
  }, [API, navigate]);

  // delivery date default
  useEffect(() => {
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 7);
    setDeliveryDate(
      delivery.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );
  }, []);

  // validate address: must contain 6-digit pincode and word "India" (same logic as before)
  const validateAddress = (text) => {
    if (!text || !text.trim()) return false;
    const pincodeRegex = /\b\d{6}\b/;
    const indiaRegex = /\bIndia\b/i;
    return pincodeRegex.test(text) && indiaRegex.test(text);
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setIsAddressFilled(validateAddress(newAddress));
  };

  // CART ACTIONS (kept same as your Cart.jsx)
  const updateQuantity = async (productId, action) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const updated = items.map((it) => ({ ...it }));
      const idx = updated.findIndex((it) => it.productId?.toString?.() === productId);
      if (idx < 0) return;

      if (action === "increase") updated[idx].quantity += 1;
      else if (action === "decrease") {
        updated[idx].quantity -= 1;
        if (updated[idx].quantity <= 0) {
          await removeItem(productId);
          return;
        }
      }

      setItems(updated);

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

      toast.info("Cart updated successfully!", {
        position: "bottom-center",
        theme: "colored",
      });
    } catch (err) {
      console.error("Quantity update error:", err);
      toast.error("Unable to update cart", { position: "bottom-center" });
    }
  };

  const removeItem = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

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
        setItems(Array.isArray(data.cart?.items) ? data.cart.items : []);
        toast.warn("Item removed from cart!", {
          position: "bottom-center",
          theme: "colored",
        });
      } else {
        toast.error(data.message || "Failed to remove item", { position: "bottom-center" });
      }
    } catch (err) {
      console.error("Remove item error:", err);
      toast.error("Failed to remove item", { position: "bottom-center" });
    }
  };

  // totals
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  // keep cart total saved for other components if needed (still optional)
  useEffect(() => {
    if (!isNaN(total) && total > 0) sessionStorage.setItem("cartTotal", total.toString());
    else sessionStorage.removeItem("cartTotal");
  }, [total]);

  // Proceed to checkout (we keep payment separate)
  // We now pass data via react-router state (no sessionStorage)
  const handleProceed = () => {
    if (!isAddressFilled) {
      toast.error("Please enter a valid address before proceeding.", { position: "bottom-center" });
      return;
    }

    // save delivery info in object
    const deliveryPayload = {
      name: user.name,
      phone: user.phone,
      address,
      deliveryDate,
      subtotal,
      tax,
      total,
      itemsCount: items.length,
    };

    // navigate to payment and pass state (no sessionStorage)
    navigate("/payment", {
      state: {
        deliveryPayload,
        subtotal,
        tax,
        total,
        items,
      },
    });
  };

  // Loading & empty states
  if (loadingCart)
    return (
      <Typography align="center" sx={{ mt: "10vh" }}>
        Loading...
      </Typography>
    );

  if (cartError)
    return (
      <Typography align="center" color="error" sx={{ mt: "10vh" }}>
        {cartError}
      </Typography>
    );

  if (!items.length)
    return (
      <div className="empty-cart">
        <ShoppingCartOutlinedIcon sx={{ fontSize: "5vh", color: "#3f0012" }} />
        <Typography variant="h5" gutterBottom sx={{ color: "#3f0012" }}>
          Your cart is empty
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#3f0012",
            color: "#fff89c",
            "&:hover": { bgcolor: "#fff89c", color: "#3f0012" },
          }}
          onClick={() => navigate("/shop")}
        >
          Shop Now
        </Button>
        <ToastContainer />
      </div>
    );

  return (
    <Container fluid className="delivery-section" style={{ padding: "3vh 3vw 10vh 3vw" }}>
      {/* DELIVERY CARD */}
      <Paper className="delivery-card" elevation={4} style={{ marginBottom: "3vh", padding: "2vh 2vw" }}>
        <Typography className="delivery-title" variant="h5" gutterBottom>
          <LocalShippingIcon sx={{ mr: 1 }} /> Delivery Details
        </Typography>
        <Divider className="divider" />

        <Form className="delivery-form" style={{ marginTop: "1.2vh" }}>
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Deliver To:</Form.Label>
            <Form.Control type="text" value={user.name} readOnly className="form-input" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label">Phone Number:</Form.Label>
            <Form.Control type="text" value={user.phone} readOnly className="form-input" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label">Address:</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              style={{ resize: "none" }}
              placeholder="Enter your full address with city, state, pincode, and India"
              value={address}
              onChange={handleAddressChange}
              required
              className="form-input"
            />
            {address && !validateAddress(address) && (
              <Typography variant="caption" color="error">
                Please enter a valid Indian address (contains pincode and India).
              </Typography>
            )}
          </Form.Group>

          <Typography variant="body1" className="delivery-timing">
            <strong>Estimated Delivery:</strong> {deliveryDate}
          </Typography>

          <div className="delivery-notes" style={{ marginTop: "1vh" }}>
            <Typography variant="body2" className="note-text">
              <BlockIcon fontSize="small" /> No Return Policy
            </Typography>
            <Typography variant="body2" className="note-text">
              <AutorenewIcon fontSize="small" /> 15 Days Exchange Policy
            </Typography>
            <Typography variant="body2" className="note-text">
              <CreditCardIcon fontSize="small" /> No Cash on Delivery
            </Typography>
          </div>
        </Form>
      </Paper>

      {/* CART + SUMMARY */}
      <Grid container spacing={4} className="cart-main">
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Paper key={item.productId} className="cart-item" style={{ marginBottom: "1.2vh", padding: "1vh" }}>
              <div className="item-info" style={{ display: "flex", gap: "1.2vh", alignItems: "center" }}>
                <img src={item.image} alt={item.name} className="item-img" style={{ width: "10vw", maxWidth: "120px", height: "auto", objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <Typography className="item-name" style={{ fontWeight: 600 }}>{item.name}</Typography>
                  <Typography className="item-price">₹{fmtINR(item.price)}</Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6vh" }}>
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
              </div>
            </Paper>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className="order-summary" style={{ padding: "1.2vh 1.2vw" }}>
            <Typography className="summary-title" style={{ fontWeight: 700, marginBottom: "0.6vh" }}>Order Summary</Typography>
            <Divider style={{ marginBottom: "1vh" }} />
            <Stack spacing={1}>
              <div className="summary-row" style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Subtotal:</Typography>
                <Typography>₹{fmtINR(subtotal)}</Typography>
              </div>
              <div className="summary-row" style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Shipping (5%):</Typography>
                <Typography>₹{fmtINR(tax)}</Typography>
              </div>
              <Divider />
              <div className="summary-total" style={{ display: "flex", justifyContent: "space-between", marginTop: "0.6vh", fontWeight: 700 }}>
                <Typography>Total:</Typography>
                <Typography className="summary-amount">₹{fmtINR(total)}</Typography>
              </div>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* STICKY FOOTER */}
      <Slide direction="up" in mountOnEnter unmountOnExit>
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
            backgroundColor: "#aa0a37ff",
            color: "#fff89c",
            borderRadius: "12px 12px 0 0",
            zIndex: 1300,
          }}
        >
          <div>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Total: ₹{total.toLocaleString("en-IN")}
            </Typography>
            <Typography variant="caption">Includes shipping & taxes</Typography>
          </div>

          <div>
            <Button
              variant="contained"
              sx={{
                bgcolor: isAddressFilled ? "#fff89c" : "rgba(255,255,255,0.3)",
                color: "#3f0012",
                px: 3,
              }}
              disabled={!isAddressFilled}
              onClick={handleProceed}
            >
              Proceed to Checkout
            </Button>
          </div>
        </Paper>
      </Slide>

      <ToastContainer position="bottom-center" autoClose={2000} />
    </Container>
  );
}
