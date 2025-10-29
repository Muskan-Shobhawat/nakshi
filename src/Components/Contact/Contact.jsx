import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Typography } from "@mui/material";
import "../../CSS/Contact/Contact.css";

export default function Contact() {
  return (
    <Container fluid className="contact-page">
      <Row className="justify-content-center mb-5">
        <Col xs={12} lg={8} className="text-center">
          <Typography variant="h4" className="contact-heading">
            Contact Us
          </Typography>
          <Typography variant="body1" className="contact-subtext">
            We’d love to hear from you! Reach out for any queries or feedback.
          </Typography>
        </Col>
      </Row>

      {/* Contact Info */}
      <Row className="justify-content-center mb-5">
        <Col xs={12} md={4} className="contact-info">
          <Typography variant="h6" className="gold-text">
            📍 Address
          </Typography>
          <Typography variant="body1">
            Bhadwasiya, Jodhpur, Rajasthan, India
          </Typography>
        </Col>

        <Col xs={12} md={4} className="contact-info">
          <Typography variant="h6" className="gold-text">
            📞 Phone
          </Typography>
          <Typography variant="body1">+91 946100859</Typography>
        </Col>

        <Col xs={12} md={4} className="contact-info">
          <Typography variant="h6" className="gold-text">
            ✉️ Email
          </Typography>
          <Typography variant="body1">nakshi1gmgold@gmail.com</Typography>
        </Col>
      </Row>

      {/* Contact Form */}
      <Row className="justify-content-center mb-8">
        <Col xs={12} lg={6}>
          <Typography variant="h5" className="gold-text text-center mb-4">
            Send Us a Message
          </Typography>
          <Form className="contact-form">
            <Form.Group className="mb-4">
              <Form.Control type="text" placeholder="Your Name" />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control type="email" placeholder="Your Email" />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Your Message"
              />
            </Form.Group>
            <div className="text-center">
              <Button className="send-btn" disabled>
                Submit (Coming Soon)
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      {/* Return & Exchange Policy */}
      <Row className="policy-section">
        <Col xs={12} lg={10}>
          <Typography variant="h4" className="gold-heading">
            Return & Exchange Policy
          </Typography>
          <Typography variant="body1" className="policy-text">
            - Products can be exchanged within 15 days of delivery. <br />
            - Exchange allowed only once per order. <br />
            - Items eligible for exchange must be unused, undamaged, and in
            their original packaging with tags intact. <br />
            - Sale, clearance, or damaged packaging items are non-exchangeable. <br />
            - For higher value exchanges, the difference will be paid by the customer. <br />
            - For lower value exchanges, the remaining amount will be refunded
            through the original payment method. <br />
            - Warranty: 1 Year on all products. <br />
            - Contact us at <b>nakshi1gmgold@gmail.com</b> or call{" "}
            <b>946100859</b>.
          </Typography>
        </Col>
      </Row>

      {/* Terms & Conditions */}
      <Row className="policy-section">
        <Col xs={12} lg={10}>
          <Typography variant="h4" className="gold-heading">
            Terms & Conditions
          </Typography>
          <Typography variant="body1" className="policy-text">
            - Welcome to NakshiJewellers.com. By using this website, you agree
            to our terms and policies. <br />
            - All products and prices are subject to change without prior notice. <br />
            - The company reserves the right to cancel or refuse any order for
            any reason. <br />
            - Payments must be made securely through authorized payment gateways. <br />
            - Nakshi Jewellers is not liable for delays due to unforeseen
            circumstances like logistics or weather. <br />
            - All content, logos, and designs are owned by Nakshi Jewellers. <br />
            - Any dispute will be subject to jurisdiction in Jodhpur, Rajasthan.
          </Typography>
        </Col>
      </Row>

      {/* Privacy Policy */}
      <Row className="policy-section">
        <Col xs={12} lg={10}>
          <Typography variant="h4" className="gold-heading">
            Privacy Policy
          </Typography>
          <Typography variant="body1" className="policy-text">
            - Nakshi Jewellers respects your privacy and ensures data
            confidentiality. <br />
            - We collect only essential details for order processing and
            communication. <br />
            - Your information is never sold or shared with third parties. <br />
            - Payment data is handled securely via trusted gateways. <br />
            - You can contact us for data updates or removal requests. <br />
            - Our site uses cookies to enhance your shopping experience. <br />
            - For any concerns, email us at{" "}
            <b>nakshi1gmgold@gmail.com</b>.
          </Typography>
        </Col>
      </Row>
    </Container>
  );
}
