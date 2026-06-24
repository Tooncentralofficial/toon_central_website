"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
//@ts-ignore
import "swiper/css";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";
import { ShortsType } from "@/helpers/types";
import { DarkEyeIcon, Seeall, ToonShortsLogo } from "../_shared/icons/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import KebleCard from "../_shared/cards/kebleCard";

function HomeShorts({ offset = 0 }: { offset?: number } = {}) {
  const { token } = useSelector(selectAuthState);
  const router = useRouter();
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["shorts-home"],
    queryFn: () => getRequest("home/shorts-carousel?page=1&limit=10"),
  });

  const allShorts = data?.data?.shorts || [];
  const shorts = offset > 0
    ? [...allShorts.slice(offset), ...allShorts.slice(0, offset)]
    : allShorts;

  const getShortViews = (item: ShortsType) =>
    item?.viewsCount ?? item?.viewCount ?? item?.likesAndViews?.[0]?.views ?? 0;

  const handleVideoHover = (index: number, play: boolean) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (play) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  if (isLoading) {
    return <ShortsSkeleton />;
  }

  return (
    <div className="parent-wrap pt-10 md:py-10 md:pt-10">
      <div className="child-wrap">
        <div className="flex justify-between items-center">
          <ToonShortsLogo className="w-18 h-12 mb-4" />
          <Link href={"/shorts"} className="mb-4">
            <Seeall />
          </Link>
        </div>
        <div className="w-full justify-center flex md:hidden">
          <Swiper
            spaceBetween={12}
            slidesPerGroup={1}
            slidesPerView={2.3}
            slidesPerGroupAuto={true}
            allowTouchMove={true}
            touchRatio={1}
            threshold={10}
            className="w-full py-4"
          >
            {shorts.map((item: ShortsType, index: number) => (
              <SwiperSlide key={item.id}>
                <div
                  className="bg-[#1e1e1e] rounded-medium h-[250px] flex items-center justify-center cursor-pointer relative overflow-hidden transition-transform duration-300 ease-out hover:scale-105"
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
                    const deltaX = Math.abs(touchEnd.x - touchStartRef.current.x);
                    const deltaY = Math.abs(touchEnd.y - touchStartRef.current.y);
                    if (deltaX < 10 && deltaY < 10) {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/shorts/${item.uuid}`);
                    }
                    touchStartRef.current = null;
                  }}
                  onClick={() => router.push(`/shorts/${item.uuid}`)}
                  onMouseEnter={() => handleVideoHover(index, true)}
                  onMouseLeave={() => handleVideoHover(index, false)}
                >
                  <div className="absolute top-0 left-0 z-20 pointer-events-none">
                    <div className="font-bold text-xl bg-[#3EFFA2] flex items-center gap-[0.2rem] m-1 rounded-full px-1 h-3 overflow-hidden">
                      <p className="text-[6.7px] text-[#061A29]">
                        {getShortViews(item)}
                      </p>
                      <DarkEyeIcon width={10} height={10} />
                    </div>
                  </div>
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[index] = el;
                    }}
                    src={item.upload}
                    preload="metadata"
                    className="w-full h-full object-cover rounded-medium pointer-events-none"
                    controls={false}
                    playsInline
                    muted
                  />
                </div>
              </SwiperSlide>
            ))}
            <SwiperSlide>
              <KebleCard />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="w-full justify-center hidden md:flex">
          <Swiper
            slidesPerGroup={1}
            loop={true}
            breakpoints={{
              0: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
            }}
            slidesPerGroupAuto
            className="w-full py-4"
          >
            {shorts.map((item: ShortsType, index: number) => (
              <SwiperSlide key={item.id}>
                <Link
                  href={`/shorts/${item.uuid}`}
                  className="block w-full h-full"
                >
                  <div
                    className="bg-[#1e1e1e] rounded-medium h-[135px] sm:h-[250px] md:h-[320px] flex items-center justify-center cursor-pointer relative overflow-hidden transition-transform duration-300 ease-out hover:scale-105"
                    onMouseEnter={() => handleVideoHover(index, true)}
                    onMouseLeave={() => handleVideoHover(index, false)}
                  >
                    <div className="absolute top-0 left-0 z-20 pointer-events-none">
                      <div className="font-bold text-xl bg-[#3EFFA2] flex items-center gap-[0.2rem] m-1 rounded-full px-1 h-3 overflow-hidden">
                        <p className="text-[6.7px] md:text-[12px] text-[#061A29]">
                          {getShortViews(item)}
                        </p>
                        <DarkEyeIcon width={10} height={10} />
                      </div>
                    </div>
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[index] = el;
                      }}
                      src={item.upload}
                      preload="metadata"
                      className="w-full h-full object-cover rounded-medium pointer-events-none"
                      controls={false}
                      playsInline
                      muted
                    />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
            <SwiperSlide>
              <KebleCard />
            </SwiperSlide>
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
        <ToonShortsLogo className="w-18 h-12 mb-4" />
        <div className="h-8 w-32 bg-gray-700/30 rounded animate-pulse mb-6"></div>
        <div className="w-full flex justify-center">
          <div className="w-full py-10 flex md:hidden gap-5 justify-center">
            {[0, 1].map((index) => (
              <div
                key={index}
                className="w-full h-[320px] bg-[var(--bg-secondary)] rounded-2xl animate-pulse"
              />
            ))}
          </div>
          <div className="w-full py-10 hidden md:flex gap-5 justify-center">
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
