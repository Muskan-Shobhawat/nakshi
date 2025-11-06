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
      img: "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2Fnakshiwooo.jpg?alt=media&token=127b247e-6b1b-4cf4-993a-a220317f9cb6",
      // optional per-slide crop focus:
      position: "center center",
    },
    {
      id: 2,
      img: "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2Fnakshiwooo.jpg?alt=media&token=127b247e-6b1b-4cf4-993a-a220317f9cb6",
      position: "center top",
    },
    {
      id: 3,
      img: "https://firebasestorage.googleapis.com/v0/b/nakshi-69052.firebasestorage.app/o/jewellery%2Fnakshiwooo.jpg?alt=media&token=127b247e-6b1b-4cf4-993a-a220317f9cb6",
      position: "center center",
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
              {/* put overlay text/buttons here if needed */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroSection;
