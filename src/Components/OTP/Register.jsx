import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import "../../CSS/OTP/AuthForm.css";
import OtpPopup from "./OtpPopup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showOtp, setShowOtp] = useState(false);
  const [signupPhone, setSignupPhone] = useState("");

  const API = import.meta.env.VITE_APP_BACKEND_URI;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!/^[6789]\d{9}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number format.";
    if (!formData.password.match(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8}$/))
      newErrors.password =
        "Password must include one capital letter, one number, and be exactly 8 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch(`${API}user/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "OTP sending failed.", { position: "bottom-center" });
        return;
      }

      toast.success("OTP sent successfully!", { position: "bottom-center" });
      setSignupPhone(formData.phone);
      setShowOtp(true);
    } catch (error) {
      console.error("Send OTP Error:", error);
      toast.error("Could not send OTP. Please try again.", { position: "bottom-center" });
    }
  };

  return (
    <div className="auth-section">
      {/* <Container fluid className="ccfix"> */}
      <ToastContainer />
            <div className="auth-card">
              <h3 className="text-center mb-4 text-brown">Sign Up - Nakshi</h3>
              <Form onSubmit={handleRegisterSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <PersonIcon /> Full Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                  {errors.fullName && <p className="error">{errors.fullName}</p>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <PhoneIcon /> Phone Number
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
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
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    maxLength="8"
                    required
                  />
                  {errors.password && <p className="error">{errors.password}</p>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <LockIcon /> Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    maxLength="8"
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="error">{errors.confirmPassword}</p>
                  )}
                </Form.Group>

                <Button className="gold-btn w-100" type="submit">
                  Sign Up
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small>
                  Already have an account?{" "}
                  <a href="/login" className="switch-link">
                    Login
                  </a>
                </small>
              </div>
            </div>
      {/* </Container> */}

      <OtpPopup
        phone={signupPhone}
        show={showOtp}
        onClose={() => setShowOtp(false)}
        onVerify={async (verifiedPhone) => {
          try {
            const res = await fetch(`${API}user/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: formData.fullName,
                phone: verifiedPhone,
                password: formData.password,
              }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
              toast.success("Registration successful!", { position: "bottom-center" });
              setShowOtp(false);
              setTimeout(() => (window.location.href = "/login"), 2000);
            } else {
              toast.error(data.message || "Registration failed", { position: "bottom-center" });
            }
          } catch (err) {
            console.error("Register Error after OTP:", err);
            toast.error("Something went wrong while registering", { position: "bottom-center" });
          }
        }}
      />
    </div>
  );
}
