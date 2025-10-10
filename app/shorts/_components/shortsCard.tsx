"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { DarkEyeIcon } from "../../_shared/icons/icons";
import Likes from "../../_shared/cards/likes";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "../../_shared/icons/icons";

import "swiper/css";
// @ts-ignore
import "swiper/css/pagination";
interface ShortsCardProps {
  short: any;
  featured: boolean;
  index: number;
}

export default function ShortsCard({
  short,
  featured,
  index,
}: ShortsCardProps) {
  const swiperRef: any = useRef(null);
  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const ArrowCircle = ({ type }: { type: "left" | "right" }) => {
    return (
      <div
        onClick={type === "left" ? handlePrev : handleNext}
        className={`absolute top-[50%] translate-y-[-50%] ${
          type === "left" ? "left-[-60px]" : "right-[-60px]"
        } rounded-[50%] h-10 w-10 bg-[var(--green100)] hidden md:inline-grid place-items-center cursor-pointer z-10`}
      >
        {type === "left" ? <ArrowLeft /> : <ArrowRight />}
      </div>
    );
  };
  const [isHovered, setIsHovered] = useState(false);
  const views = short?.likesAndViews?.views?.length || 0;

  return (
    <div className="w-full h-full flex justify-center items-center relative">
      <div className="relative h-[600px] w-[480px] overflow-hidden rounded-md">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          direction={"vertical"}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="h-full w-full"
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <SwiperSlide className="h-full w-full">
            <img
              src={short.image}
              alt={short.title}
              className="h-full w-full object-cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </SwiperSlide>
          <SwiperSlide className="h-full w-full">
            <img
              src={short.image}
              alt={short.title}
              className="h-full w-full object-cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </SwiperSlide>
          <SwiperSlide className="h-full w-full">
            <img
              src={short.image}
              alt={short.title}
              className="h-full w-full object-cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <div>
        <ArrowCircle type="left" />
        <ArrowCircle type="right" />
      </div>
    </div>
  );
}
