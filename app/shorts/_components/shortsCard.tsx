"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon, CommentShortsIcon, DarkEyeIcon, DislikeIcon, LikeIcon, ShareShortsIcon } from "../../_shared/icons/icons";
import Likes from "../../_shared/cards/likes";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Autoplay } from "swiper/modules";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/pagination";
interface ShortsCardProps {
  short: any;
  featured: boolean;
  index: number;
  setCommentOpen: (open: any) => void;
}

export default function ShortsCard({
  short,
  featured,
  index,
  setCommentOpen
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
        className={` ${
          type === "left" ? "left-[-60px]" : "right-[-60px]"
        } rounded-[50%] h-10 w-10 bg-[#2E3747] hidden md:inline-grid place-items-center cursor-pointer z-10`}
      >
        {type === "left" ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </div>
    );
  };
  const [isHovered, setIsHovered] = useState(false);
  const views = short?.likesAndViews?.views?.length || 0;

  return (
    <div className="w-full  h-[90vh] md:h-[90vh] lg:h-full flex justify-center items-center relative flex-1">
      <div className="flex gap-5 ">
        <div className="relative h-[60vw] max-h-[600px] w-full max-w-[480px] overflow-hidden rounded-md">
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
        <div className="flex flex-col gap-10 justify-end mb-5">
          <div>
            <LikeIcon />
          </div>
          <div>
            <DislikeIcon />
          </div>
          <div onClick={()=>setCommentOpen((prev: any) => !prev)} >
            <CommentShortsIcon />
          </div>
          <div>
            <ShareShortsIcon />
          </div>
        </div>
        <div className="flex flex-col gap-5  justify-center">
          <ArrowCircle type="left" />
          <ArrowCircle type="right" />
        </div>
      </div>
    </div>
  );
}
