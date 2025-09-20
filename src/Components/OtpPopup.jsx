import { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

export default function OtpPopup({ phone, show, onClose, onVerify }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const API = import.meta.env.VITE_APP_BACKEND_URI;
      const res = await fetch(`${API}user/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp: Number(otp) }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Account verified successfully!");
        onVerify?.(); // call parent callback
        onClose?.(); // close the modal
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

  const handleChange = (e) => {
    // Allow only digits and max 6 characters
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) setOtp(value);
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
            onChange={handleChange}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleVerify} disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
