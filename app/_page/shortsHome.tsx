"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
//@ts-ignore
import "swiper/css";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";

function HomeShorts() {
  const slides = [
    { id: 1, title: "3D Animation" },
    { id: 2, title: "Bestyy Ad" },
    { id: 3, title: "Ratatouille" },
    { id: 4, title: "Another Slide" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="parent-wrap pt-10 md:py-10 md:pt-0 ">
      <div className="child-wrap">
        <H2SectionTitle title="Toon Shorts" />
        <div className="w-full flex justify-center">
          <Swiper
            centeredSlides
            slidesPerGroup={1}
            slidesPerView={3}
            spaceBetween={20}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="w-full py-10"
          >
            {slides.map((slide, index) => (
              <SwiperSlide
                key={slide.id}
                style={{
                  width: "230px", 
                  transition: "all 0.4s ease",
                  transform:
                    index === activeIndex ? "scale(1.1)" : "scale(0.9)",
                  opacity: index === activeIndex ? 1 : 0.6,
                }}
              >
                <div className="bg-[#1e1e1e] rounded-2xl h-[500px] flex flex-col items-center justify-center text-white text-xl font-bold">
                  {slide.title}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default HomeShorts;
