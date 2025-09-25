import React, { useRef, useState, useEffect } from "react";
import "../CSS/Gender.css";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Replace these with your real images (place inside src/assets)
import womenHero from "../assets/women.mp4";
import menHero from "../assets/men.mp4";
import w1 from "../assets/t1.JPG";
import w2 from "../assets/t1.JPG";
import w3 from "../assets/t1.JPG";
import m1 from "../assets/t1.JPG";
import m2 from "../assets/t1.JPG";
import m3 from "../assets/t1.JPG";

export default function GenderShowcase() {
  const [selected, setSelected] = useState("women"); // 'women' or 'men'
  const listRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Sample products (replace with real data or fetch from API)
  const womenProducts = [
    { id: "w1", name: "Pearl Necklace", price: 2200, image: w1 },
    { id: "w2", name: "Diamond Earrings", price: 8900, image: w2 },
    { id: "w3", name: "Gold Bangle", price: 3200, image: w3 },
    { id: "w4", name: "Kundan Ring", price: 4500, image: w1 },
    { id: "w5", name: "Layered Chain", price: 1500, image: w2 },
  ];

  const menProducts = [
    { id: "m1", name: "Men's Chain", price: 1800, image: m1 },
    { id: "m2", name: "Signet Ring", price: 2900, image: m2 },
    { id: "m3", name: "Cuff Bracelet", price: 2400, image: m3 },
    { id: "m4", name: "Minimal Pendant", price: 1200, image: m1 },
    { id: "m5", name: "Classic Watch", price: 12000, image: m2 },
  ];

  const products = selected === "women" ? womenProducts : menProducts;

  // Scroll helper: scroll by approximately two cards width
  const scroll = (direction = 1) => {
    const el = listRef.current;
    if (!el) return;
    const card = el.querySelector(".gs-card");
    const cardWidth = card
      ? card.getBoundingClientRect().width
      : (30 * window.innerWidth) / 100;
    const amount = Math.round(cardWidth * 2 + (2 * window.innerWidth) / 100); // account for gap
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  // update arrow visibility
  const updateScrollButtons = () => {
    const el = listRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth + 5 < el.scrollWidth);
  };

  useEffect(() => {
    // Update when selection changes or window resized
    const el = listRef.current;
    if (el) {
      el.scrollLeft = 0; // reset scroll on selection change
      updateScrollButtons();
    }
    const onResize = () => updateScrollButtons();
    window.addEventListener("resize", onResize);
    if (el) el.addEventListener("scroll", updateScrollButtons);
    return () => {
      window.removeEventListener("resize", onResize);
      if (el) el.removeEventListener("scroll", updateScrollButtons);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <section className="gs-root" aria-label="Jewellery by gender">
      {/* Top selector */}
      <div className="gs-top">
        {/* <div
          className={`gs-tile ${selected === "women" ? "active" : "inactive"}`}
          onClick={() => setSelected("women")}
          style={{ backgroundImage: `url(${womenHero})` }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setSelected("women")}
        >
          <div className="gs-tile-label">Women</div>
        </div> */}

        <div
          className={`hero-item ${
            selected === "women" ? "active" : "inactive"
          }`}
          onClick={() => setSelected("women")}
        >
          <video
            className="hero-video"
            src={womenHero}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="overlay">Women</div>
        </div>

        {/* <div
          className={`gs-tile ${selected === "men" ? "active" : "inactive"}`}
          onClick={() => setSelected("men")}
          style={{ backgroundImage: `url(${menHero})` }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setSelected("men")}
        >
          <div className="gs-tile-label">Men</div>
        </div> */}
        {/* Men Video */}
        <div
          className={`hero-item ${
            selected === "men" ? "active" : "inactive"
          }`}
          onClick={() => setSelected("men")}
        >
          <video
            className="hero-video"
            src={menHero}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="overlay">Men</div>
        </div>
      </div>

      {/* Carousel */}
      <div className="gs-carousel-wrap">
        <IconButton
          className="gs-arrow gs-left"
          onClick={() => scroll(-1)}
          disabled={!canScrollLeft}
          aria-label="scroll left"
        >
          <ArrowBackIosIcon />
        </IconButton>

        <div className="gs-carousel" ref={listRef} aria-live="polite">
          {products.map((p) => (
            <Card className="gs-card" key={p.id} elevation={3}>
              <CardMedia
                component="img"
                image={p.image}
                alt={p.name}
                className="gs-card-media"
              />
              <CardContent className="gs-card-content">
                <Typography variant="subtitle1" className="gs-card-title">
                  {p.name}
                </Typography>
                <Typography variant="body2" className="gs-card-price">
                  ₹{p.price.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>

        <IconButton
          className="gs-arrow gs-right"
          onClick={() => scroll(1)}
          disabled={!canScrollRight}
          aria-label="scroll right"
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
    </section>
  );
}
