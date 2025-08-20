import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import "../CSS/AuthForm.css";
import OtpPopup from "./OtpPopup";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
   const [showOtp, setShowOtp] = useState(false);
  const [signupPhone, setSignupPhone] = useState(""); 

  const toggleForm = () => {
    setIsLogin(!isLogin);
    resetForm(); // prevent values leaking between modes
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!isLogin && !formData.fullName)
      newErrors.fullName = "Full Name is required.";

    if (!formData.phone) {
      newErrors.phone = "Phone Number is required.";
    } else if (!formData.phone.match(/^[6789]\d{9}$/)) {
      newErrors.phone =
        "Phone Number must start with 6, 7, 8, or 9 and be 10 digits long.";
    }

    // Email optional during signup; if provided, validate
    if (formData.email) {
      if (
        !formData.email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
      ) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!formData.password.match(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8}$/)) {
      newErrors.password =
        "Password must include a capital letter, a number, and be exactly 8 characters.";
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm Password is required.";
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Safely parse JSON (or capture HTML/text error pages)
  const safeJSON = async (res) => {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json();
    const text = await res.text();
    return { success: false, message: text };
  };

  const handleRegisterSubmit = async () => {
    if (!validate()) return;

    try {
      const API = import.meta.env.VITE_APP_BACKEND_URI;
      const res = await fetch(`${API}user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email || undefined, // optional
          password: formData.password,
        }),
           credentials: "include", 
      });

      const data = await safeJSON(res);
      if (!res.ok || !data.success) {
        alert(data.message || `Registration failed (status ${res.status}).`);
        return;
      }

       setSignupPhone(formData.phone);
      setShowOtp(true);
      resetForm();
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleLoginSubmit = async () => {
    if (!formData.phone || !formData.password) {
      alert("Please enter both phone number and password.");
      return;
    }
    try {
      const API = import.meta.env.VITE_APP_BACKEND_URI;

      const res = await fetch(`${API}user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
        }),
         credentials: "include", 
      });

      const data = await safeJSON(res);
      if (!res.ok || !data.success) {
        alert(data.message || `Login failed (status ${res.status}).`);
        return;
      }

      localStorage.setItem("token", data.token);
      alert(data.message || "Login successful.");
      resetForm();
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) handleLoginSubmit();
    else handleRegisterSubmit();
  };

  return (
    <div className="auth-section">
      <Container fluid className="ccfix">
        <Row className="justify-content-center rrfix">
          <Col xs={12} sm={10} md={8} lg={6} xl={5} className="fix">
            <div className="auth-card">
              <h3 className="text-center mb-4 text-brown">
                {isLogin ? "Login" : "Sign Up"} - Nakshi
              </h3>

              <Form onSubmit={handleSubmit}>
                {!isLogin && (
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
                    {errors.fullName && (
                      <p className="error">{errors.fullName}</p>
                    )}
                  </Form.Group>
                )}

                {/* Phone always visible */}
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
                    pattern="^[6789]\d{9}$"
                    required
                  />
                  {errors.phone && <p className="error">{errors.phone}</p>}
                </Form.Group>

                {/* Email optional on signup */}
                {!isLogin && (
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <EmailIcon /> Email (Optional)
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                  </Form.Group>
                )}

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
                    pattern="^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8}$"
                    required
                  />
                  {errors.password && (
                    <p className="error">{errors.password}</p>
                  )}
                </Form.Group>

                {!isLogin && (
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
                      required
                      maxLength="8"
                      title="Confirm password must match the original password"
                    />
                    {errors.confirmPassword && (
                      <p className="error">{errors.confirmPassword}</p>
                    )}
                  </Form.Group>
                )}

                <Button className="gold-btn w-100" type="submit">
                  {isLogin ? "Login" : "Sign Up"}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small>
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <span className="switch-link" onClick={toggleForm}>
                    {isLogin ? "Sign Up" : "Login"}
                  </span>
                </small>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* ✅ OTP popup */}
      <OtpPopup
        phone={signupPhone}
        show={showOtp}
        onClose={() => setShowOtp(false)}
        onVerify={() => {
          resetForm();
          setIsLogin(true); // go to login after OTP verified
        }}
      />
    </div>
  );
}
