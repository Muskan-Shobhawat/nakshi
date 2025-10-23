// JewelryHeroSection.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import { Typography, Button, Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "../../CSS/Home/Explore.css";
import imageA from "../../assets/exp1.JPG";
import imageB from "../../assets/exp2.JPG";

const JewelryHeroSection = ({
  title = "Jewelry which fit everyone budget and taste !",
  description = `Jewelry business is highly competitive. Many new and established companies are competing in the market armed. Jewelry business is highly competitive. Many new and established companies are competing in the market armed.`,
  // imageA = '../assets/exp1.JPG',
  // imageB = '../assets/exp2.JPG',
  onExplore = () => {},
}) => {
  return (
    <section className="jewelry-hero-section" aria-label="Jewelry hero">
      <Container>
        <Row className="align-items-center flex-column-reverse flex-md-row">
          {/* Text Section */}
          <Col md={7}>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <Typography
                component="h2"
                variant="h4"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  mb: 2,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                {title}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#6b6b6b",
                  mb: 3,
                  lineHeight: 1.6,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                {description}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Button
                  className="btnexxp"
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  onClick={onExplore}
                  aria-label="Explore collection"
                >
                  Explore Collection
                </Button>
              </Box>
            </Box>
          </Col>

          {/* Image Section */}
          <Col md={5} className="images-col mb-0 mb-md-0 cc">
            <div className="image-stack" aria-hidden>
              <div className="img-wrap img-a">
                <img src={imageA} alt="Model wearing jewelry A" />
              </div>
              <div className="img-wrap img-b">
                <img src={imageB} alt="Model wearing jewelry B" />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default JewelryHeroSection;
