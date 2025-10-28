import React, { useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import { Paper, Typography, Divider } from "@mui/material";
import "../../CSS/Order/DeliveryDetails.css";
import { useNavigate } from "react-router-dom";

export default function DeliveryDetails() {
  const [user, setUser] = useState({ name: "", phone: "" });
  const [deliveryDate, setDeliveryDate] = useState("");
    // const [isAddressFilled, setIsAddressFilled] = useState(false);
  const [total, setTotal] = useState(0);
  const API = import.meta.env.VITE_APP_BACKEND_URI;
  const navigate = useNavigate();

    useEffect(() => {
    const storedTotal = Number(sessionStorage.getItem("cartTotal") || 0);
    setTotal(storedTotal);
  }, []);

  // ✅ Check login & fetch user details
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

  // ✅ Address validation: must include city, state, India & pincode
  const validateAddress = (text) => {
    if (!text.trim()) return false;

    // Common Indian city/state/pincode pattern (basic)
    const cityRegex = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/; // capitalized words
    const stateRegex = /\b(Maharashtra|Rajasthan|Gujarat|Punjab|Delhi|Karnataka|Tamil\s?Nadu|Kerala|Madhya\s?Pradesh|Uttar\s?Pradesh|Haryana|Bihar|West\s?Bengal|Odisha|Chhattisgarh|Assam|Jharkhand|Goa|Telangana|Andhra\s?Pradesh|Uttarakhand)\b/i;
    const pincodeRegex = /\b\d{6}\b/;
    const indiaRegex = /\bIndia\b/i;

    return (
      cityRegex.test(text) &&
      stateRegex.test(text) &&
      pincodeRegex.test(text) &&
      indiaRegex.test(text)
    );
  };


  // // ✅ Notify Cart.jsx when delivery info is valid
  // useEffect(() => {
  //   const isValid = user.name && user.phone && validateAddress(address);
  //   if (isValid) {
  //     onDetailsComplete?.({
  //       name: user.name,
  //       phone: user.phone,
  //       address,
  //       isValid: true,
  //     });
  //   } else {
  //     onDetailsComplete?.({ isValid: false });
  //   }
  // }, [user, address, onDetailsComplete]);

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
              onChange={(e) => setAddress(e.target.value)}
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
            <Slide direction="up" in={true} mountOnEnter unmountOnExit>
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
          <Typography variant="body1">
            Total Amount: ₹{total?.toLocaleString("en-IN") || 0}
          </Typography>

          <Button
            variant="contained"
            sx={{
              bgcolor: isAddressFilled ? "white" : "rgba(255,255,255,0.5)",
              color: "#a60019",
              cursor: isAddressFilled ? "pointer" : "not-allowed",
            }}
            disabled={!isAddressFilled}
            onClick={() => alert("Proceeding to checkout...")}
          >
            Proceed to Checkout
          </Button>
        </Paper>
      </Slide>
    </Container>
  );
}

