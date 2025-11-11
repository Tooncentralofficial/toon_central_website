// ...existing code...
"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownIcon,
  ArrowLeftLong,
  ArrowRight,
  ArrowUpIcon,
  CommentShortsIcon,
  DarkEyeIcon,
  DislikeIcon,
  LikeIcon,
  ShareShortsIcon,
} from "../../_shared/icons/icons";
import Likes from "../../_shared/cards/likes";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Autoplay } from "swiper/modules";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/pagination";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { Button } from "@nextui-org/react";
import { array } from "yup";
import ShortsComments from "./shortscomments";
interface ShortsCardProps {
  short: any;
  featured: boolean;
  index: number;
  setCommentOpen: (open: any) => void;
  commentsOpen: boolean;
}

export default function ShortsCard({
  short,
  featured,
  index,
  setCommentOpen,
  commentsOpen,
}: ShortsCardProps) {
  const { user, token } = useSelector(selectAuthState);
  const photo = user?.photo || "";

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
    <div className="w-full h-[82.7vh] md:h-[90vh] lg:h-[80vh] block md:flex md:justify-center md:items-center relative flex-1 overflow-hidden">
      <div className="block md:flex  md:gap-10 overflow-hidden">
        <div className="absolute left-2  z-[22] flex flex-col justify-between h-full">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 ">
              <h3 className="text-[#FCFCFDB2] text-xl">Short Title</h3>
              <div className="bg-[#475467] px-3 py-1 rounded-2xl">
                Subscribe
              </div>
            </div>
            <h3 className="text-lg md:text-2xl">CHRYSALIS Vol. 1: Fallout</h3>

            <div className="flex gap-3">
              <p className="border-[1px] px-3 py-1 border-[#05834BF5]">
                Comedy
              </p>
              <p className="border-[1px] px-3 py-1 border-[#05834BF5]">
                Shorts
              </p>
              <p className="border-[1px] px-3 py-1 border-[#05834BF5]"> 2023</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#05834B]  w-full justify-center py-2 rounded-md md:mb-8">
            watch more <ArrowRight />
          </button>
        </div>
        <div className="relative h-[82.7vh] md:h-[60vw] md:max-h-[600px] w-full md:max-w-[480px] rounded-md z-10">
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
        <div className="absolute md:static right-5 bottom-0 z-[22] flex flex-col gap-10 justify-end mb-5">
          <div>
            <LikeIcon className="w-10 h-10 text-[#05834B]" />
          </div>
          <div>
            <DislikeIcon className="w-10 h-10 text-[#05834B]" />
          </div>
          <div onClick={() => setCommentOpen((prev: any) => !prev)}>
            <CommentShortsIcon className="w-10 h-10" />
          </div>
          <div>
            <ShareShortsIcon className="w-10 h-10" />
          </div>
          <div className="overflow-hidden w-10 h-10 rounded-full">
            <Image
              src={photo}
              width={50}
              height={50}
              alt={"title"}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5  justify-center ml-5">
          <ArrowCircle type="left" />
          <ArrowCircle type="right" />
        </div>
      </div>
      <AnimatePresence>
        <motion.div
          className="absolute left-0 bottom-0 z-[23] flex md:hidden flex-col gap-4 bg-[#0D111D] w-full overflow-hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: commentsOpen ? 1 : 0,
            height: commentsOpen ? "70vh" : "1vh",
            y: commentsOpen ? 0 : 20,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <p onClick={() => setCommentOpen(false)} className="py-2 px-4 cursor-pointer w-full flex justify-end">X</p>
          <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
            {Array(10)
              .fill(0)
              .map((_, idx) => (
                <ShortsComments key={idx} />
              ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
// ...existing code...
