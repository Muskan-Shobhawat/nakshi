import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Box, Typography, Paper } from "@mui/material";
import axios from "axios";
import "../../CSS/UserBased/AccountPage.css";

export default function Profile() {
  const [user, setUser] = useState({ id: "", name: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const API = import.meta.env.VITE_APP_BACKEND_URI;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${API}user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [API]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Session expired, please login again.");

    if (!user.address.trim())
      return alert("Address cannot be empty.");

    try {
      setSaving(true);
      const res = await axios.put(
        `${API}user/update-profile`,
        { name: user.name, address: user.address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        alert("Profile updated successfully!");
      } else {
        alert(res.data.message || "Update failed.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Typography align="center" sx={{ mt: "5vh" }}>
        Loading profile...
      </Typography>
    );

  return (
    <Container fluid className="d-flex justify-content-center mt-5 acctd">
      <Paper
        elevation={3}
        sx={{
          width: "60vw",
          padding: "4vh 3vw",
          borderRadius: "2vh",
          background: "#fffaf2",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          My Profile
        </Typography>

        <Row>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Enter full name"
                style={{ height: "5vh", fontSize: "1.8vh" }}
              />
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                value={user.id}
                disabled
                style={{
                  height: "5vh",
                  fontSize: "1.8vh",
                  background: "#f8f8f8",
                }}
              />
            </Form.Group>
          </Col>

          <Col xs={12}>
            <Form.Group className="mb-3">
              <Form.Label>Delivery Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={
                  user.address
                    ? user.address
                    : "Address will appear after your first order."
                }
                onChange={handleChange}
                disabled={!user.address}
                placeholder="Enter your delivery address"
                style={{ fontSize: "1.8vh" }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Box sx={{ textAlign: "center", mt: "3vh" }}>
          <Button
            variant="dark"
            onClick={handleSave}
            disabled={saving || !user.address}
            style={{
              padding: "1vh 4vw",
              fontSize: "1.8vh",
              borderRadius: "1vh",
              opacity: !user.address ? 0.6 : 1,
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
