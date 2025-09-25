import React from 'react';
import heroImage from '../assets/heroimg2.png'; // Replace with jewelry image

function HeroSection() {
  return (
    <section
      className="hero-section text-light d-flex align-items-center hrfix"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: '0vw -5vh',
        height: '90vh'
      }}
    >
      <div className="container text-center">
        <h1 className="display-4 fw-bold">Golden Touch to Your Everyday</h1>
        <p className="lead">Premium 1gm Gold-Plated Designs for Timeless Beauty</p>
        <a href="#" className="btn btn-outline-light btn-lg mt-3 exp">
          Explore Now
        </a>
      </div>
    </section>
  );
}

export default HeroSection;
