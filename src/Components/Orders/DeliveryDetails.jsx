import React, { useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import { Paper, Typography, Divider, Slide, Button } from "@mui/material";
import "../../CSS/Order/DeliveryDetails.css";
import { useNavigate } from "react-router-dom";

export default function DeliveryDetails() {
  const [user, setUser] = useState({ name: "", phone: "" });
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isAddressFilled, setIsAddressFilled] = useState(false);
  const [total, setTotal] = useState(0);
  const API = import.meta.env.VITE_APP_BACKEND_URI;
  const navigate = useNavigate();

  // ✅ Load total from sessionStorage safely
  useEffect(() => {
    const stored = sessionStorage.getItem("cartTotal");
    if (stored && !isNaN(stored)) {
      setTotal(Number(stored));
    } else {
      setTotal(0);
    }
  }, []);

  // ✅ Fetch user details using cart userId
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = sessionStorage.getItem("cartUserId");

    if (!token || !userId) {
      alert("Please login to continue with delivery details.");
      navigate("/");
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
        } else {
          console.error("User fetch failed:", data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [API, navigate]);

  // ✅ Delivery date (7 days ahead)
  useEffect(() => {
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + 7);
    setDeliveryDate(
      delivery.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    );
  }, []);

  // ✅ Validate Indian Address
  const validateAddress = (text) => {
    if (!text.trim()) return false;
    const stateRegex = /\b(Rajasthan|Maharashtra|Delhi|Punjab|Gujarat|Karnataka|Tamil\s?Nadu|Kerala|Uttar\s?Pradesh|Bihar|West\s?Bengal|Madhya\s?Pradesh|Haryana|Odisha|Telangana|Andhra\s?Pradesh|Uttarakhand)\b/i;
    const pincodeRegex = /\b\d{6}\b/;
    const indiaRegex = /\bIndia\b/i;
    return stateRegex.test(text) && pincodeRegex.test(text) && indiaRegex.test(text);
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setIsAddressFilled(validateAddress(newAddress));
  };

  const handleCheckout = () => {
    alert(`✅ Proceeding to checkout!\n\nTotal: ₹${total.toLocaleString("en-IN")}\nDeliver To: ${user.name}\nPhone: ${user.phone}\nDelivery Date: ${deliveryDate}`);
  };

  return (
    <Container fluid className="delivery-section">
      <Paper className="delivery-card" elevation={4}>
        <Typography className="delivery-title" variant="h5" gutterBottom>
          Delivery Details 🚚
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
              placeholder="Enter full address (city, state, pincode, India)"
              value={address}
              onChange={handleAddressChange}
              required
              className="form-input"
            />
            {address && !validateAddress(address) && (
              <Typography variant="caption" color="error" sx={{ fontSize: "1.6vh" }}>
                ⚠️ Please enter a valid Indian address with city, state, and 6-digit pincode.
              </Typography>
            )}
          </Form.Group>

          <Typography variant="body1">
            <strong>Estimated Delivery:</strong> {deliveryDate}
          </Typography>
          <Typography variant="body2" className="note-text">❌ No Return Policy</Typography>
          <Typography variant="body2" className="note-text">🔁 15 Days Exchange Policy</Typography>
          <Typography variant="body2" className="note-text">💳 No Cash on Delivery</Typography>
        </Form>
      </Paper>

      {/* ✅ Bottom Checkout Bar */}
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: "2vh 3vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#a60019",
            color: "white",
            borderRadius: "2vh 2vh 0 0",
            zIndex: 1300,
          }}
        >
          <Typography variant="h6">
            Total Amount: ₹{total.toLocaleString("en-IN")}
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: isAddressFilled ? "white" : "rgba(255,255,255,0.5)",
              color: "#a60019",
              cursor: isAddressFilled ? "pointer" : "not-allowed",
            }}
            disabled={!isAddressFilled}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </Paper>
      </Slide>
    </Container>
  );
}
