// src/components/Payment/Payment.jsx
import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Image, Alert, Spinner } from "react-bootstrap";

const API = import.meta.env.VITE_APP_BACKEND_URI || "";
const DEFAULT_QR = import.meta.env.VITE_PHONEPE_QR || "https://i.imgur.com/6KQ2Z8B.png"; // replace with your PhonePe QR

export default function Payment({ amount = "", onComplete }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [doneMessage, setDoneMessage] = useState(null);
  const [error, setError] = useState("");

  // helper to generate order id
  const makeOrderId = () =>
    "ORD" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 7).toUpperCase();

  const handleFile = (e) => {
    setError("");
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setFile(null);
      setPreview("");
      return;
    }
    // optional size limit (5MB)
    if (f.size > 5 * 1024 * 1024) {
      setError("Screenshot too large. Max 5MB allowed.");
      setFile(null);
      setPreview("");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const submitOrder = async () => {
    setError("");
    if (!file) {
      setError("Please upload a payment screenshot before confirming.");
      return;
    }
    // optional: require user name/phone
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    const id = makeOrderId();
    setOrderId(id);

    const payloadMeta = {
      orderId: id,
      amount: amount || null,
      name: name || null,
      phone,
      method: "PhonePe-QR",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // If backend present, try to POST multipart/form-data to `${API}orders`
    if (API) {
      try {
        const formData = new FormData();
        formData.append("screenshot", file);
        formData.append("meta", JSON.stringify(payloadMeta));

        const res = await fetch(`${API}orders`, {
          method: "POST",
          body: formData,
          // don't set content-type to let browser set multipart boundary
          // include token if you expect auth: Authorization: Bearer <token>
          headers: {
            // 'Authorization': `Bearer ${localStorage.getItem('token')}` // uncomment if needed
          },
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          // fallback: still treat as local if backend not implemented
          console.warn("Order API returned non-ok:", data);
          // save locally as fallback
          saveLocalOrder(payloadMeta, preview);
          setDoneMessage("Order saved locally (server returned an error). Admin will see it when you inform them.");
        } else {
          setDoneMessage(data?.message || "Payment submitted. We'll verify and update order status soon.");
        }
      } catch (err) {
        console.error("Order submit error:", err);
        // fallback to local save
        saveLocalOrder(payloadMeta, preview);
        setDoneMessage("Could not reach server — order saved locally. Admin will see it when you inform them.");
      } finally {
        setLoading(false);
      }
    } else {
      // no API configured: save locally
      saveLocalOrder(payloadMeta, preview);
      setLoading(false);
      setDoneMessage("No backend configured — order stored locally. Admin will see it when you inform them.");
    }
  };

  // saves order into localStorage 'pendingOrders' (admin later can read)
  const saveLocalOrder = (meta, screenshotDataUrl) => {
    const existing = JSON.parse(localStorage.getItem("pendingOrders") || "[]");
    existing.unshift({ meta, screenshot: screenshotDataUrl });
    localStorage.setItem("pendingOrders", JSON.stringify(existing));
  };

  const handleConfirmClick = async () => {
    await submitOrder();
    // optionally call parent handler
    if (typeof onComplete === "function") onComplete({ orderId, status: "pending" });
  };

  return (
    <Container className="py-4">
      {!doneMessage ? (
        <>
          <Row className="justify-content-center mb-3">
            <Col xs={12} md={8} lg={6}>
              <div className="p-3 border rounded text-center">
                <h5 className="mb-2">Pay with PhonePe</h5>
                <p className="mb-2">Scan this QR using PhonePe / Google Pay / any UPI app</p>
                <div style={{ maxWidth: 320, margin: "0 auto" }}>
                  <Image src={DEFAULT_QR} fluid rounded alt="PhonePe QR" />
                </div>
                <p className="mt-3 mb-0">Amount: {amount ? `₹${amount}` : "Enter at checkout"}</p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Your name (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Your phone (for order communication)</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="10-digit phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Upload payment screenshot (required)</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleFile} />
                </Form.Group>

                {preview && (
                  <div className="mb-3" style={{ textAlign: "center" }}>
                    <p className="small mb-1">Preview</p>
                    <img
                      src={preview}
                      alt="preview"
                      style={{ maxWidth: "260px", maxHeight: "260px", objectFit: "cover", borderRadius: 8 }}
                    />
                  </div>
                )}

                {error && <Alert variant="danger">{error}</Alert>}

                <div className="d-flex gap-2">
                  <Button variant="secondary" onClick={() => { setFile(null); setPreview(""); setError(""); }}>
                    Reset
                  </Button>

                  <Button variant="primary" onClick={handleConfirmClick} disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden />
                        <span className="ms-2">Submitting...</span>
                      </>
                    ) : (
                      "Confirm Payment"
                    )}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </>
      ) : (
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Alert variant="success" className="text-center">
              <h4>Thank you for shopping with us!</h4>
              <p>Please wait for <strong>15 to 20 minutes</strong> while we confirm your payment.</p>
              <p>Your order id is: <strong>{orderId}</strong></p>
              <p className="mb-0">We will update your order status in the admin panel shortly.</p>
            </Alert>

            <div className="text-center mt-3">
              <Button variant="outline-primary" onClick={() => window.location.href = "/"}>
                Continue shopping
              </Button>{" "}
              <Button variant="primary" onClick={() => window.location.href = "/orders"}>
                View my orders
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}
