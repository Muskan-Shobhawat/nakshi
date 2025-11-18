// src/components/Payment/Payment.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Image, Alert, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "../../CSS/Payment/Payment.css";

// Firebase helpers
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../Firebase/Firebase.js"; // your existing Firebase config export

const API = import.meta.env.VITE_APP_BACKEND_URI || "";
const DEFAULT_QR =
  import.meta.env.VITE_PHONEPE_QR ||
  "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2FPhonePe.jpg?alt=media&token=62ecf4c6-6a81-4e4c-a805-bed08057536b";

export default function Payment({ onComplete }) {
  const location = useLocation();
  const navigate = useNavigate();
  const deliveryPayload = location?.state?.deliveryPayload || null;

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [txnId, setTxnId] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [doneMessage, setDoneMessage] = useState(null);
  const [error, setError] = useState("");

  // redirect if user opened /payment directly
  useEffect(() => {
    if (!deliveryPayload) {
      navigate("/cart", { replace: true });
    }
  }, [deliveryPayload, navigate]);

  // derive amount and read-only name/phone/address
  const amount = deliveryPayload?.total ?? "";
  const name = deliveryPayload?.name ?? "";
  const phone = deliveryPayload?.phone ?? "";
  const address = deliveryPayload?.address ?? "";

  // helper to generate order id
  const makeOrderId = () =>
    "ORD" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 7).toUpperCase();

  // Upload file to firebase storage and return download URL
  async function uploadToFirebase(file, folder = "orders") {
    if (!file) throw new Error("No file provided");
    const timestamp = Date.now();
    // sanitize filename
    const safeName = (file.name || "ss").replace(/\s+/g, "-").toLowerCase();
    const path = `${folder}/${timestamp}-${Math.random().toString(36).slice(2,8)}-${safeName}`;
    const ref = storageRef(storage, path);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(ref, file);

      uploadTask.on(
        "state_changed",
        // progress - optional
        () => {},
        // error
        (err) => reject(err),
        // complete
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }

  const handleFile = (e) => {
    setError("");
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setFile(null);
      setPreview("");
      return;
    }

    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(f.type)) {
      setError("Only JPG / JPEG / PNG files are allowed.");
      setFile(null);
      setPreview("");
      return;
    }

    if (f.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum allowed size is 10MB.");
      setFile(null);
      setPreview("");
      return;
    }

    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const validTxn = (t) => {
    if (!t) return false;
    return /^[A-Z0-9]{4,}$/.test(t);
  };

  const submitOrder = async () => {
    setError("");
    if (!file) {
      setError("Please upload a payment screenshot before confirming.");
      return false;
    }
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      setError("Invalid phone in delivery details.");
      return false;
    }
    if (!validTxn(txnId)) {
      setError("Transaction ID is required and must contain only uppercase letters (A-Z) and digits (0-9).");
      return false;
    }

    setLoading(true);
    const id = makeOrderId();
    setOrderId(id);

    const payloadMeta = {
      orderId: id,
      amount: amount || null,
      name: name || null,
      phone,
      address,
      method: "PhonePe-QR",
      txnId,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      // 1) Upload screenshot to Firebase and get URL
      const screenshotUrl = await uploadToFirebase(file, "orders");

      // 2) POST order metadata + screenshotUrl to backend
      const body = {
        meta: payloadMeta,
        screenshotUrl,
      };

      const token = localStorage.getItem("token");
      const res = await fetch(`${API}orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // include auth header if your orders endpoint requires it:
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.warn("Order API returned non-ok:", data);
        // if server returned an error, still show local-success fallback
        setDoneMessage("Order saved locally (server returned an error). Admin will see it when you inform them.");
        // optionally save local fallback
        saveLocalOrder(payloadMeta, preview, screenshotUrl);
      } else {
        setDoneMessage(data?.message || "Payment submitted. We'll verify and update order status soon.");
      }
    } catch (err) {
      console.error("Order submit/upload error:", err);
      // if Firebase permission error or network error, show clear message
      if (err?.code === "storage/unauthorized" || /unauthorized/i.test(String(err.message))) {
        setError(
          "Upload failed: Firebase Storage permission denied. Please check your Firebase Storage rules or authenticate the user."
        );
      } else {
        setError("Order submit/upload failed. See console for details.");
      }
      // fallback: save locally so order is not lost
      saveLocalOrder(payloadMeta, preview, null);
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }

    return true;
  };

  const saveLocalOrder = (meta, screenshotDataUrl, screenshotUrl = null) => {
    const existing = JSON.parse(localStorage.getItem("pendingOrders") || "[]");
    existing.unshift({ meta, screenshot: screenshotDataUrl, screenshotUrl });
    localStorage.setItem("pendingOrders", JSON.stringify(existing));
  };

  const handleConfirmClick = async () => {
    const ok = await submitOrder();
    if (ok) {
      setDoneMessage("Thank you! Your order has been submitted.");
      if (typeof onComplete === "function") onComplete({ orderId, status: "pending" });
    }
  };

  return (
    <Container className="payment-root">
      {!doneMessage ? (
        <div className="payment-card">
          <h3 className="payment-title">Confirm Payment</h3>

          <div className="payment-grid">
            <div className="left-col">
              <div className="qr-box">
                <h5>Scan to pay</h5>
                <img src={DEFAULT_QR} alt="PhonePe QR" className="qr-img" />
                <p className="amount-txt">Amount: {amount ? `₹${Number(amount).toLocaleString("en-IN")}` : "₹0"}</p>
              </div>

              <div className="delivery-summary">
                <h6>Delivery Details</h6>
                <div className="row"><label>Name</label><div className="val">{name}</div></div>
                <div className="row"><label>Phone</label><div className="val">{phone}</div></div>
                <div className="row"><label>Address</label><div className="val addr">{address}</div></div>
              </div>
            </div>

            <div className="right-col">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Transaction ID (required) </Form.Label>
                  <Form.Control
                    type="text"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value.trim().toUpperCase())}
                    placeholder="E.g. ABCD1234"
                    maxLength={64}
                  />
                  <small className="muted">Only uppercase letters A–Z and digits 0–9. Min 4 chars.</small>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Upload payment screenshot (JPG / PNG / JPEG, ≤ 10MB)</Form.Label>
                  <Form.Control type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleFile} />
                </Form.Group>

                {preview && (
                  <div className="preview-wrap">
                    <p className="small mb-1">Preview</p>
                    <img src={preview} alt="preview" className="preview-img" />
                  </div>
                )}

                {error && <Alert variant="danger">{error}</Alert>}

                <div className="actions">
                  <Button variant="secondary" onClick={() => { setFile(null); setPreview(""); setError(""); setTxnId(""); }}>
                    Reset
                  </Button>
                  <Button variant="primary" onClick={handleConfirmClick} disabled={loading}>
                    {loading ? <><Spinner animation="border" size="sm" /> Submitting...</> : "Confirm Payment"}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      ) : (
        <div className="done-card">
          <Alert variant="success" className="text-center">
            <h4>Thank you for shopping with us!</h4>
            <p>Please wait for <strong>15 to 20 minutes</strong> while we confirm your payment.</p>
            <p>Your order id is: <strong>{orderId}</strong></p>
            <p className="mb-0">We will update your order status shortly.</p>
          </Alert>

          <div className="done-actions">
            <Button variant="outline-primary" onClick={() => navigate("/")}>Continue shopping</Button>{" "}
            <Button variant="primary" onClick={() => navigate("/orders")}>View my orders</Button>
          </div>
        </div>
      )}
    </Container>
  );
}
