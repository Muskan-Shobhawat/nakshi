import React from "react";
// import heroVideo from "../../assets/hero.mp4"; // your video file
import "../../CSS/Home/HeroSection.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function HeroSection() {
  // const heroVideo = "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2Fhero.mp4?alt=media&token=3d7711a1-5b49-421b-9621-711b9fdbaad5";
   const slides = [
    {
      id: 1,
      // title: "Premium 1 Gram Gold-Plated Designs",
      // subtitle: "Golden Touch to Your Everyday",
      // description:
      //   "From the blue city of Jodhpur, we bring you jewellery that tells stories in gold. Each design is a fusion of tradition and modern elegance, handcrafted to perfection.",
      // btn: "Explore Now",
      img: "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2Fnakshihero.jpg?alt=media&token=4b1d8105-5bcf-4d1c-b89a-dfcd8eda5057",
    },
    {
      id: 2,
      // title: "Traditional Craftsmanship, Modern Glamour",
      // subtitle: "Elegance That Shines Through Generations",
      // description:
      //   "Discover timeless jewellery that bridges heritage with style. Each piece speaks of artistry and grace.",
      // btn: "Shop Collection",
      img: "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2Fnakshihero.jpg?alt=media&token=4b1d8105-5bcf-4d1c-b89a-dfcd8eda5057",
    },
    {
      id: 3,
      // title: "Shine Brighter Every Day",
      // subtitle: "Affordable Luxury, Crafted for You",
      // description:
      //   "Our 1 gram gold jewellery brings sophistication within reach. Wear the shine of confidence every day.",
      // btn: "View Designs",
      img: "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2Fnakshihero.jpg?alt=media&token=4b1d8105-5bcf-4d1c-b89a-dfcd8eda5057",
    },
  ];
  return (
    <section className="hero-section hrfix">
      {/* 🔹 Background Video */}
      {/* <video
        className="hero-video"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
      /> */}

      {/* 🔹 Overlay content */}
      {/* <div className="hero-overlay text-light text-left ff">
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
      </div> */}

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="hero-slide"
              style={{
                backgroundImage: `url(${slide.img})`,
              }}
            >
              {/* <div className="hero-overlay text-light ff">
                <h1 className="display-5 fw-bold heads">{slide.title}</h1>
                <p className="lead">{slide.subtitle}</p>
                <p className="lead2">{slide.description}</p>
                <a href="#" className="btn btn-outline-light btn-lg mt-3 exp">
                  {slide.btn}
                </a>
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroSection;
