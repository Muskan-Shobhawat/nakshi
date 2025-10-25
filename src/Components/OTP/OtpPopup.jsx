import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";

export default function OtpPopup({ phone, show, onClose, onVerify }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [timer, setTimer] = useState(0); // resend cooldown timer

  const API = import.meta.env.VITE_APP_BACKEND_URI;

  // 🕒 Countdown for resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ✉️ Resend OTP
  const handleResend = async () => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const res = await fetch(`${API}user/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: "OTP sent again successfully!", type: "success" });
        setTimer(60); // 60 seconds cooldown (matches backend cooldown logic)
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

  // 🧮 Handle OTP input
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // digits only
    if (value.length <= 6) setOtp(value);
  };

  // ✅ Verify OTP
  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setMessage({ text: "Please enter a valid 6-digit OTP.", type: "danger" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const res = await fetch(`${API}user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ text: "OTP verified successfully!", type: "success" });

        // ✅ Trigger parent callback with verified phone
        if (onVerify) onVerify(phone);

        // Close popup after short delay
        setTimeout(() => {
          onClose?.();
          setOtp("");
          setMessage({ text: "", type: "" });
        }, 1000);
      } else {
        setMessage({
          text: data.message || "Invalid or expired OTP. Please try again.",
          type: "danger",
        });
      }
    } catch (err) {
      console.error("VERIFY OTP ERROR:", err);
      setMessage({ text: "Server error while verifying OTP.", type: "danger" });
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
          <Form.Label>
            Enter OTP sent to <strong>{phone}</strong>
          </Form.Label>
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
            "Verify OTP"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
