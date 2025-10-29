import React from "react";
// import heroVideo from "../../assets/hero.mp4"; // your video file
import "../../CSS/Home/HeroSection.css";

function HeroSection() {
  const heroVideo = "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2Fhero.mp4?alt=media&token=3d7711a1-5b49-421b-9621-711b9fdbaad5";
  return (
    <section className="hero-section hrfix">
      {/* 🔹 Background Video */}
      <video
        className="hero-video"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* 🔹 Overlay content */}
      <div className="hero-overlay text-light text-left ff">
        <h1 className="display-4 fw-bold heads">
          Premium 1 Gram Gold-Plated Designs
        </h1>
        <p className="lead">Golden Touch to Your Everyday</p>
        <p className="lead2">
          From the blue city of Jodhpur, we bring you jewellery that tells
          stories in gold. Each design is a fusion of tradition and modern
          elegance, handcrafted to perfection. With Nakshi, experience the
          luxury of 1 Gram Gold, redefined for your timeless beauty.
        </p>
        <a href="#" className="btn btn-outline-light btn-lg mt-3 exp">
          Explore Now
        </a>
      </div>
    </section>
  );
}

export default HeroSection;
