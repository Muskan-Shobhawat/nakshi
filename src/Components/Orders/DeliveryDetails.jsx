import React, { useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import {
  Paper,
  Typography,
  Divider,
  Slide,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BlockIcon from "@mui/icons-material/Block";
import "../../CSS/Order/DeliveryDetails.css";
import { useNavigate } from "react-router-dom";

export default function DeliveryDetails() {
  const [user, setUser] = useState({ name: "", phone: "" });
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isAddressFilled, setIsAddressFilled] = useState(false);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });
  const API = import.meta.env.VITE_APP_BACKEND_URI;
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("cartTotal");
    if (stored && !isNaN(stored)) setTotal(Number(stored));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = sessionStorage.getItem("cartUserId");
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API}user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setUser({
            name: data.user?.name || "",
            phone: data.user?.phone || "",
          });
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [API, navigate]);

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

  const validateAddress = (text) => {
    if (!text.trim()) return false;
    const pincodeRegex = /\b\d{6}\b/;
    const indiaRegex = /\bIndia\b/i;
    return pincodeRegex.test(text) && indiaRegex.test(text);
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setIsAddressFilled(validateAddress(newAddress));
  };

  const handleCheckout = () => {
    setToast({
      open: true,
      message: `Proceeding to checkout — ₹${total.toLocaleString("en-IN")}`,
      severity: "success",
    });
  };

  return (
    <Container fluid className="delivery-section">
      <Paper className="delivery-card" elevation={4}>
        <Typography className="delivery-title" variant="h5" gutterBottom>
          <LocalShippingIcon sx={{ mr: 1 }} /> Delivery Details
        </Typography>
        <Divider className="divider" />

        <Form className="delivery-form">
          <Form.Group className="mb-4">
            <Form.Label className="form-label">Deliver To:</Form.Label>
            <Form.Control type="text" value={user.name} readOnly className="form-input" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="form-label">Phone Number:</Form.Label>
            <Form.Control type="text" value={user.phone} readOnly className="form-input" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="form-label">Address:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              style={{ resize: "none" }}
              placeholder="Enter your full address with city, state, pincode, and India"
              value={address}
              onChange={handleAddressChange}
              required
              className="form-input"
            />
            {address && !validateAddress(address) && (
              <Typography variant="caption" color="error">
                Please enter a valid Indian address with city, state, and pincode.
              </Typography>
            )}
          </Form.Group>

          <Typography variant="body1" className="delivery-timing">
            <strong>Estimated Delivery:</strong> {deliveryDate}
          </Typography>

          <div className="delivery-notes">
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

      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Paper className="delivery-footer" elevation={6}>
          <Typography variant="h6">Total: ₹{total.toLocaleString("en-IN")}</Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: isAddressFilled ? "#fff89c" : "rgba(255,255,255,0.4)",
              color: "#3f0012",
            }}
            disabled={!isAddressFilled}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </Paper>
      </Slide>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ open: false, message: "" })}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
