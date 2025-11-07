import React from "react";
import "../../CSS/Home/HeroSection.css";
import { Carousel } from "react-bootstrap";

function HeroSection() {
  const slides = [
    {
      id: 1,
      img: "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2F2.jpg?alt=media&token=880de144-ed03-491b-92ac-d5058a037420",
      cta: { label: "EXPLORE NOW", href: "#collection" },
    },
    {
      id: 2,
      img: "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2FNAKSHI6.jpg?alt=media&token=7b66219f-fca8-4143-9c29-81dd3f7b0c28",
    },
    {
      id: 3,
      img: "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2Fnakshiwooo.jpg?alt=media&token=127b247e-6b1b-4cf4-993a-a220317f9cb6",
    },
  ];

  return (
    <section className="hero-section hrfix">
      <Carousel
        fade
        interval={4000}
        controls
        indicators
        pause="hover"
        className="hero-carousel"
      >
        {slides.map((s) => (
          <Carousel.Item key={s.id} className="hero-slide">
            <div className="hero-card">
              <div className="hero-img-wrapper">
                <img
                  className="hero-img"
                  src={s.img}
                  alt={`Slide ${s.id}`}
                  loading="eager"
                />
              </div>

              {s.cta && (
                <a href={s.cta.href} className="hero-cta">
                  {s.cta.label}
                </a>
              )}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
}

export default HeroSection;
