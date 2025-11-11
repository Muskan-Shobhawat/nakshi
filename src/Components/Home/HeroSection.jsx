import React from "react";
import "../../CSS/Home/HeroSection.css";
import { Carousel } from "react-bootstrap";

function HeroSection() {
  const slides = [
    {
      id: 1,
      img: "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2F2.jpg?alt=media&token=e469a120-b656-4827-9689-f400adea0c50",
      cta: { label: "EXPLORE NOW", href: "#collection" },
    },
    {
      id: 2,
      img: "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2F4.jpg?alt=media&token=8a4d5405-3a4e-46a4-b7a0-b8bca11d6d22",
    },
    {
      id: 3,
      img: "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2F5.jpg?alt=media&token=bf9afb62-1cce-4711-bc38-fd5647a272a2",
    },
  ];

  return (
    <section className="hero-section hrfix">
      <Carousel
   fade
        interval={6000}   // autoplay speed (in ms)
        controls={false}  // 🔸 disables arrows
        indicators        // 🔸 keeps dots
        pause={false}     // 🔸 keeps autoplay even on hover
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
