import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography } from "@mui/material";
import "../../CSS/About/About.css";

export default function About() {
  return (
    <Container fluid className="about-page">
      <Row className="justify-content-center text-center mb-5">
        <Col xs={12} lg={8}>
          <Typography variant="h4" className="about-heading">
            About Nakshi Jewellers
          </Typography>
          <Typography variant="body1" className="about-subtext">
            Crafting timeless beauty in every piece, Nakshi Jewellers brings together artistry, tradition, and trust.  
            Based in Jodhpur, Rajasthan, we are committed to delivering pure elegance through our gold and handcrafted jewellery.  
          </Typography>
        </Col>
      </Row>

      <Row className="align-items-center about-section">
        <Col xs={12} md={6} className="about-text">
          <Typography variant="h5" className="gold-heading mb-3">
            Our Story ✨
          </Typography>
          <Typography variant="body1" className="about-body">
            Founded with a passion for craftsmanship and heritage, Nakshi Jewellers stands as a name synonymous with purity and artistry.
            Each creation reflects the dedication of skilled artisans who ensure every detail shines with precision and emotion.
          </Typography>
        </Col>

        <Col xs={12} md={6} className="about-image-section">
          <img
            src="https://images.unsplash.com/photo-1600180758890-6f450c0f02eb?auto=format&fit=crop&w=800&q=80"
            alt="Nakshi Jewellery Craftsmanship"
            className="about-image"
          />
        </Col>
      </Row>

      <Row className="align-items-center about-section reverse">
        <Col xs={12} md={6} className="about-image-section">
          <img
            src="https://images.unsplash.com/photo-1617033184450-1d0e4b74b65a?auto=format&fit=crop&w=800&q=80"
            alt="Gold Jewellery Design"
            className="about-image"
          />
        </Col>

        <Col xs={12} md={6} className="about-text">
          <Typography variant="h5" className="gold-heading mb-3">
            Our Promise 💛
          </Typography>
          <Typography variant="body1" className="about-body">
            Every piece from Nakshi Jewellers is a symbol of trust and quality.  
            With one-year warranty and ethical sourcing, we ensure every ornament becomes part of your story — one that glows forever.
          </Typography>
        </Col>
      </Row>

      <Row className="text-center mt-5">
        <Col xs={12}>
          <Typography variant="h6" className="gold-heading">
            Visit Us
          </Typography>
          <Typography variant="body1" className="about-body">
            📍 Bhadwasiya, Jodhpur, Rajasthan, India  
            <br />
            📞 +91 946100859 | ✉️ nakshi1gmgold@gmail.com  
            <br />
            🌐 www.nakshijewellers.com
          </Typography>
        </Col>
      </Row>
    </Container>
  );
}
