import React, { useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import { Paper, Typography, Divider } from "@mui/material";
import "../../CSS/Order/DeliveryDetails.css";
import { useNavigate } from "react-router-dom";

export default function DeliveryDetails() {
  const [user, setUser] = useState({ name: "", phone: "" });
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const API = import.meta.env.VITE_APP_BACKEND_URI;
  const navigate = useNavigate();

  // ✅ Fetch user details via /cart (token-based)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to continue with delivery details.");
      navigate("/");
      return;
    }

    const fetchUserFromCart = async () => {
      try {
        const res = await fetch(`${API}cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setUser({
            name: data.name || "",
            phone: data.phone || "",
          });
        } else {
          alert("Failed to fetch user details. Please login again.");
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (err) {
        console.error("Error fetching cart details:", err);
        navigate("/");
      }
    };

    fetchUserFromCart();
  }, [API, navigate]);

  // ✅ Calculate delivery date (7 days from today)
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

  // ✅ Basic Indian address validation (for user feedback only)
  const validateAddress = (text) => {
    if (!text.trim()) return false;
    const stateRegex =
      /\b(Maharashtra|Rajasthan|Gujarat|Punjab|Delhi|Karnataka|Tamil\s?Nadu|Kerala|Madhya\s?Pradesh|Uttar\s?Pradesh|Haryana|Bihar|West\s?Bengal|Odisha|Chhattisgarh|Assam|Jharkhand|Goa|Telangana|Andhra\s?Pradesh|Uttarakhand)\b/i;
    const pincodeRegex = /\b\d{6}\b/;
    const indiaRegex = /\bIndia\b/i;
    return stateRegex.test(text) && pincodeRegex.test(text) && indiaRegex.test(text);
  };

  // ✅ Store address in session storage (Cart will check it)
  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    sessionStorage.setItem("userAddress", newAddress);
  };

  return (
    <Container fluid className="delivery-section">
      <Paper className="delivery-card" elevation={4}>
        <Typography className="delivery-title" variant="h5" gutterBottom>
          Delivery Details 🚚
        </Typography>
        <Divider className="divider" />

        <Form className="delivery-form">
          {/* Deliver To */}
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
              placeholder="Enter your full address with city, state, pincode, and India"
              value={address}
              onChange={handleAddressChange}
              required
              className="form-input"
            />
            {address && !validateAddress(address) && (
              <Typography
                variant="caption"
                color="error"
                sx={{ fontSize: "1.6vh" }}
              >
                ⚠️ Please enter a valid Indian address with city, state, and
                6-digit pincode.
              </Typography>
            )}
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

// ✅ Export a simple function: just checks if address exists
export function checkDeliveryFilled() {
  const address = sessionStorage.getItem("userAddress");
  return !!(address && address.trim().length > 0);
}
