import React from "react";
import "../../CSS/Home/HeroSection.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function HeroSection() {
  const slides = [
    {
      id: 1,
      img: "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2F2.jpg?alt=media&token=880de144-ed03-491b-92ac-d5058a037420",
      position: "center center",
      button: false, // 👈 only this slide has a button
    },
    {
      id: 2,
      img: "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2Fnakshiwooo.jpg?alt=media&token=127b247e-6b1b-4cf4-993a-a220317f9cb6",
      position: "center top",
      button: false,
    },
    {
      id: 3,
      img: "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2Fnakshiwooo.jpg?alt=media&token=127b247e-6b1b-4cf4-993a-a220317f9cb6",
      position: "center center",
      button: false,
    },
  ];

  return (
    <section className="hero-section hrfix">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        className="hero-swiper"
      >
        {slides.map((s) => (
          <SwiperSlide key={s.id}>
            <div className="hero-slide">
              <img
                className="hero-img"
                src={s.img}
                alt=""
                style={{ objectPosition: s.position || "center center" }}
                loading="eager"
              />

              {/* 👇 Add button only on the first slide */}
              {s.button && (
                <div className="hero-content">
                  <a href="#collection" className="hero-btn">
                    Explore Collection
                  </a>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroSection;
