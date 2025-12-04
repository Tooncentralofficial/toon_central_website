"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
//@ts-ignore
import "swiper/css";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useQuery } from "@tanstack/react-query";
import { getRequest, getRequestProtected } from "../utils/queries/requests";
import { ShortsType } from "@/helpers/types";

function HomeShorts() {
  const {token} = useSelector(selectAuthState)
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const slides = [
    { id: 1, title: "3D Animation" },
    { id: 2, title: "Bestyy Ad" },
    { id: 3, title: "Ratatouille" },
    { id: 4, title: "Another Slide" },
  ];

  const { data } = useQuery({
    queryKey: ["shorts"],
    queryFn: () => getRequest("home/shorts-carousel?page=1&limit=10"),
  });
  const shorts = data?.data?.shorts || []
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);
  return (
    <div className="parent-wrap pt-10 md:py-10 md:pt-0 ">
      <div className="child-wrap">
        <H2SectionTitle title="Toon Shorts" />
        <div className="w-full flex justify-center">
          <Swiper
            centeredSlides
            slidesPerGroup={1}
            breakpoints={{
              0: {
                slidesPerView: 1.4, // mobile
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 2, // tablet
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 3, // desktop
                spaceBetween: 20,
              },
            }}
            slidesPerGroupAuto
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="w-full py-10"
          >
            {shorts.map((item: ShortsType, index: number) => (
              <SwiperSlide
                key={item.id}
                style={{
                  width: "230px",
                  transition: "all 0.4s ease",
                  transform:
                    index === activeIndex ? "scale(1.1)" : "scale(0.9)",
                  opacity: index === activeIndex ? 1 : 0.6,
                }}
              >
                <div className="bg-[#1e1e1e] rounded-2xl h-[500px] flex items-center justify-center">
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[index] = el;
                    }}
                    src={item.upload}
                    className="w-full h-full object-cover"
                    controls={false}
                    playsInline
                    muted
                  />
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
