// src/Components/OTP/Login.jsx
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import "../../CSS/OTP/AuthForm.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const API = import.meta.env.VITE_APP_BACKEND_URI;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    else if (!/^[6789]\d{9}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number format.";

    if (!formData.password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch(`${API}user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "Login failed.", {
          position: "bottom-center",
        });
        return;
      }

      // Store JWT and user (important: user.role is needed client-side for admin route)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful!", { position: "bottom-center" });

      // Call callback if provided
      if (typeof onLoginSuccess === "function") onLoginSuccess(data.user);

      // Redirect by role (admin -> /admin)
      setTimeout(() => {
        if (data.user?.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      }, 800);
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please try again.", {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="auth-section">
      <ToastContainer />

      <div className="auth-card">
        <h3 className="text-center mb-4 text-brown">Login - Nakshi</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <PhoneIcon /> Phone Number
            </Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              maxLength="10"
              required
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <LockIcon /> Password
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </Form.Group>

          <Button className="gold-btn w-100" type="submit">
            Login
          </Button>
        </Form>

        <div className="text-center mt-3">
          <small>
            Don’t have an account?{" "}
            <a href="/register" className="switch-link">
              Sign Up
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}
