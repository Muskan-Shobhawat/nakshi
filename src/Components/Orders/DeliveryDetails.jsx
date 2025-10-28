import React, { useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import { Paper, Typography, Divider } from "@mui/material";
import "../../CSS/Order/DeliveryDetails.css";
import { useNavigate } from "react-router-dom";

export default function DeliveryDetails({ onDetailsComplete }) {
  const [user, setUser] = useState({ name: "", phone: "" });
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const API = import.meta.env.VITE_APP_BACKEND_URI;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to continue with delivery details.");
      navigate("/");
      return;
    }

    const fetchUserFromCart = async () => {
      try {
        // Step 1️⃣ — get userId from /cart
        const cartRes = await fetch(`${API}cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = await cartRes.json();

        if (!cartRes.ok || !cartData.success) {
          alert("Failed to fetch cart. Please login again.");
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        const userId = cartData.userId || cartData.cart?.userId;
        if (!userId) {
          alert("Unable to find user details.");
          return;
        }

        // Step 2️⃣ — fetch user details using userId (from DB directly)
        const userRes = await fetch(`${API}user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();

        if (userRes.ok && userData.success) {
          setUser({
            name: userData.user?.name || "",
            phone: userData.user?.phone || "",
          });
        } else {
          alert("Unable to fetch user information.");
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        navigate("/");
      }
    };

    fetchUserFromCart();
  }, [API, navigate]);

  // ✅ Calculate estimated delivery
  useEffect(() => {
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + 7);
    const formatted = delivery.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setDeliveryDate(formatted);
  }, []);

  // ✅ Notify parent when details complete
  useEffect(() => {
    if (user.name && user.phone && address.trim()) {
      onDetailsComplete?.({ name: user.name, phone: user.phone, address });
    }
  }, [user, address, onDetailsComplete]);

  return (
    <Container fluid className="delivery-section">
      <Paper className="delivery-card" elevation={4}>
        <Typography className="delivery-title" variant="h5" gutterBottom>
          Delivery Details 🚚
        </Typography>
        <Divider className="divider" />

        <Form className="delivery-form">
          {/* Name */}
          <Form.Group className="mb-4">
            <Form.Label className="form-label">Deliver To:</Form.Label>
            <Form.Control
              type="text"
              value={user.name}
              readOnly
              className="form-input"
            />
          </Form.Group>

          {/* Phone */}
          <Form.Group className="mb-4">
            <Form.Label className="form-label">Phone Number:</Form.Label>
            <Form.Control
              type="text"
              value={user.phone}
              readOnly
              className="form-input"
            />
          </Form.Group>

          {/* Address */}
          <Form.Group className="mb-4">
            <Form.Label className="form-label">Address:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your full delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="form-input"
            />
          </Form.Group>

          {/* Delivery Timing */}
          <div className="delivery-timing">
            <Typography variant="body1">
              <strong>Estimated Delivery:</strong> {deliveryDate}
            </Typography>
          </div>

          {/* Policy Notes */}
          <div className="delivery-notes">
            <Typography variant="body2" className="note-text">
              ❌ No Return Policy
            </Typography>
            <Typography variant="body2" className="note-text">
              🔁 15 Days Exchange Policy
            </Typography>
            <Typography variant="body2" className="note-text">
              💳 No Cash on Delivery
            </Typography>
          </div>
        </Form>
      </Paper>
    </Container>
  );
}
