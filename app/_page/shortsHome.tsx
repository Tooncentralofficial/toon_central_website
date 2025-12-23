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

  const { data, isLoading } = useQuery({
    queryKey: ["shorts"],
    queryFn: () => getRequest("home/shorts-carousel?page=1&limit=10"),
  });
  const shorts = data?.data?.shorts || []
  console.log(shorts)
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

   if (isLoading) {
     return <ShortsSkeleton />;
   }

  return (
    <div className="parent-wrap pt-10 md:py-10 md:pt-10 ">
      <div className="child-wrap">
        <H2SectionTitle title="Toon Shorts" />
        <div className="w-full justify-center flex md:hidden">
          <Swiper
            spaceBetween={12}
            slidesPerGroup={1}
            slidesPerView={1.3}
            slidesPerGroupAuto={true}
            centeredSlides={true}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="w-full py-10"
          >
            {shorts.map((item: ShortsType, index: number) => (
              <SwiperSlide
                key={item.id}
                style={{
                  transition: "all 0.4s ease",
                  transform:
                    index === activeIndex ? "scale(1.1)" : "scale(0.9)",
                  opacity: index === activeIndex ? 1 : 0.6,
                }}
              >
                <div className="bg-[#1e1e1e] rounded-medium h-[350px] flex items-center justify-center ">
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[index] = el;
                    }}
                    src={item.upload}
                    className="w-full h-full object-cover rounded-medium"
                    controls={false}
                    playsInline
                    muted
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-full justify-center hidden md:flex">
          <Swiper
            centeredSlides
            slidesPerGroup={1}
            breakpoints={{
              0: {
                slidesPerView: 3, // mobile
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 5, // tablet
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 7, // desktop
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
                <div className="bg-[#1e1e1e] rounded-medium h-[200px] flex items-center justify-center ">
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[index] = el;
                    }}
                    src={item.upload}
                    className="w-full h-full object-cover rounded-medium"
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
function ShortsSkeleton() {
  return (
    <div className="parent-wrap pt-10 md:py-10 md:pt-0">
      <div className="child-wrap">
        {/* Title skeleton */}
        <div className="h-8 w-32 bg-gray-700/30 rounded animate-pulse mb-6"></div>

        <div className="w-full flex justify-center">
          <div className="w-full py-10 flex md:hidden gap-5 justify-center">
            {/* Simple boxes in a line */}
            {[0, 1].map((index) => (
              <div
                key={index}
                className="w-full h-[320px] bg-[var(--bg-secondary)] rounded-2xl animate-pulse"
              />
            ))}
          </div>
          <div className="w-full py-10 hidden md:flex gap-5 justify-center">
            {/* Simple boxes in a line */}
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="w-[230px] h-[200px] bg-[var(--bg-secondary)] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomeShorts;
