"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
//@ts-ignore
import "swiper/css";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useQuery } from "@tanstack/react-query";
import { getRequest, getRequestProtected } from "../utils/queries/requests";
import { ShortsType } from "@/helpers/types";
import { ToonShortsLogo } from "../_shared/icons/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
function HomeShorts() {
  const { token } = useSelector(selectAuthState);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const slides = [
    { id: 1, title: "3D Animation" },
    { id: 2, title: "Bestyy Ad" },
    { id: 3, title: "Ratatouille" },
    { id: 4, title: "Another Slide" },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["shorts-home"],
    queryFn: () => getRequest("home/shorts-carousel?page=1&limit=10"),
  });
  const shorts = data?.data?.shorts || [];

  // Calculate initial slide index to fill the space
  const initialSlide = useMemo(() => {
    if (shorts?.length === 0) return 0;
    return Math.floor(shorts.length / 2);
  }, [shorts?.length]);

  // Update activeIndex when shorts are loaded for the first time
  useEffect(() => {
    if (shorts?.length > 0) {
      setActiveIndex(initialSlide);
    }
  }, [shorts?.length, initialSlide]);
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
        <ToonShortsLogo className="w-18 h-12 mb-4  " />
        <div className="w-full justify-center flex md:hidden">
          <Swiper
            spaceBetween={12}
            slidesPerGroup={1}
            slidesPerView={1.3}
            slidesPerGroupAuto={true}
            centeredSlides={true}
            initialSlide={initialSlide}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            allowTouchMove={true}
            touchRatio={1}
            threshold={10}
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
                <div
                  className="bg-[#1e1e1e] rounded-medium h-[350px] flex items-center justify-center cursor-pointer relative"
                  onTouchStart={(e) => {
                    touchStartRef.current = {
                      x: e.touches[0].clientX,
                      y: e.touches[0].clientY,
                    };
                  }}
                  onTouchEnd={(e) => {
                    if (!touchStartRef.current) {
                      router.push(`/shorts/${item.uuid}`);
                      return;
                    }
                    const touchEnd = {
                      x: e.changedTouches[0].clientX,
                      y: e.changedTouches[0].clientY,
                    };
                    const deltaX = Math.abs(
                      touchEnd.x - touchStartRef.current.x
                    );
                    const deltaY = Math.abs(
                      touchEnd.y - touchStartRef.current.y
                    );
                    // If movement is less than 10px, treat it as a tap and navigate
                    if (deltaX < 10 && deltaY < 10) {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/shorts/${item.uuid}`);
                    }
                    touchStartRef.current = null;
                  }}
                  onClick={(e) => {
                    router.push(`/shorts/${item.uuid}`);
                  }}
                >
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[index] = el;
                    }}
                    src={item.upload}

                    preload={index === activeIndex ? "auto" : "metadata"}
                    className="w-full h-full object-cover rounded-medium pointer-events-none"
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
            centeredSlides={true}
            slidesPerGroup={1}
            
            loop={true}
            breakpoints={{
              0: {
                slidesPerView: 3, // mobile
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 4, // tablet
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 5, // desktop
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
                <Link
                  href={`/shorts/${item.uuid}`}
                  className="block w-full h-full"
                >
                  <div className="bg-[#1e1e1e] rounded-medium h-[135px] sm:h-[250px] md:h-[320px] flex items-center justify-center cursor-pointer">
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[index] = el;
                      }}
                      src={item.upload}

                      preload={index === activeIndex ? "auto" : "metadata"}
                      className="w-full h-full object-cover rounded-medium pointer-events-none"
                      controls={false}
                      playsInline
                      muted
                    />
                  </div>
                </Link>
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
        <ToonShortsLogo className="w-18 h-12 mb-4  " />
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
