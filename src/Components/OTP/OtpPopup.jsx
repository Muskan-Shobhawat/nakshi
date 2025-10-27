import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";

export default function OtpPopup({ phone, show, onClose, onVerify }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [timer, setTimer] = useState(0);

  const API = import.meta.env.VITE_APP_BACKEND_URI;

  // 🕒 countdown for resend
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // 🧮 input
  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 6) setOtp(val);
  };

  // ✉️ resend OTP
  const handleResend = async () => {
    try {
      setLoading(true);
      setMessage({});
      const res = await fetch(`${API}user/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: "OTP resent successfully!", type: "success" });
        setTimer(60);
      } else {
        setMessage({
          text: data.message || "Failed to resend OTP.",
          type: "danger",
        });
      }
    } catch (err) {
      console.error("RESEND OTP ERROR:", err);
      setMessage({ text: "Server error while resending OTP.", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ verify OTP
  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setMessage({ text: "Enter valid 6-digit OTP", type: "danger" });
      return;
    }

    try {
      setLoading(true);
      setMessage({});
      const res = await fetch(`${API}user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      console.log("VERIFY:", data);
      if (res.ok && data.success) {
        setMessage({ text: "OTP verified!", type: "success" });

        // ✅ trigger parent registration
        await onVerify?.(phone);

        setTimeout(() => {
          setOtp("");
          setMessage({});
          onClose?.();
        }, 1000);
      } else {
        setMessage({
          text: data.message || "Invalid or expired OTP",
          type: "danger",
        });
      }
    } catch (err) {
      console.error("VERIFY OTP ERROR:", err);
      setMessage({ text: "Server error while verifying OTP", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Verify OTP</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group>
          <Form.Label>Enter OTP sent to <strong>{phone}</strong></Form.Label>
          <Form.Control
            type="text"
            value={otp}
            onChange={handleChange}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            disabled={loading}
          />
        </Form.Group>

        {message.text && (
          <Alert
            variant={message.type}
            className="mt-3 p-2 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            {message.text}
          </Alert>
        )}

        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button
            variant="link"
            disabled={loading || timer > 0}
            onClick={handleResend}
            className="p-0"
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </Button>
        </div>
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
