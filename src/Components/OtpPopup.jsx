import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function OtpPopup({ phone, show, onClose, onVerify }) {
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter the 6-digit OTP");
      return;
    }

    try {
      // console.log("VERIFY REQUEST PAYLOAD:", { phone, otp: Number(otp) });
      const API = import.meta.env.VITE_APP_BACKEND_URI;
      const res = await fetch(`${API}user/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // ✅ send OTP as number
        body: JSON.stringify({ phone, otp: Number(otp) }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Account verified successfully!");
        onVerify?.();
        onClose?.();
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("VERIFY OTP ERROR:", err);
      alert("Something went wrong while verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Verify OTP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Enter OTP sent to {phone}</Form.Label>
          <Form.Control
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // only digits
            placeholder="Enter 6-digit OTP"
            maxLength={6}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
