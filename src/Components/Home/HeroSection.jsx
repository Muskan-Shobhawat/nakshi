import React from "react";
import heroImage from "../../assets/heroimg2.jpg"; // Replace with jewelry image
import "../../CSS/Home/HeroSection.css";

function HeroSection() {
  return (
    <section
      className="hero-section text-light hrfix"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: '0vw 0vh',
        backgroundRepeat:'no-repeat'
      //   height: '90vh'
      }}
    >
      <div className=" text-left ff">
        <h1 className="display-4 fw-bold">Golden Touch to Your Everyday</h1>
        <p className="lead">
          Premium 1gm Gold-Plated Designs for Timeless Beauty
        </p>
        <a href="#" className="btn btn-outline-light btn-lg mt-3 exp">
          Explore Now
        </a>
      </div>
    </section>
  );
}

export default HeroSection;
