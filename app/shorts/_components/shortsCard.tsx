"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
//@ts-ignore
import "swiper/css";
//@ts-ignore
import "swiper/css/pagination";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import ShortsComments from "./shortscomments";
import { shortLike, ShortsType } from "@/helpers/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { prevRoutes } from "@/lib/session/prevRoutes";
import { toast } from "react-toastify";

interface ShortsCardProps {
  shorts: ShortsType[];
  featured: boolean;
  index: number;
  setCommentOpen: (open: any) => void;
  commentsOpen: boolean;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  shortComment: any;
}

export default function ShortsCard({
  shorts,
  featured,
  index,
  setCommentOpen,
  commentsOpen,
  setCurrentIndex,
  shortComment,
}: ShortsCardProps) {
  const queryClient = useQueryClient();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { user, token } = useSelector(selectAuthState);

  const [likes, setLikes] = useState<shortLike[]>([]);
  const photo = user?.photo || "";

  const swiperRef: any = useRef(null);

  // Handle video playback when slide changes
  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex;
    setCurrentSlideIndex(newIndex);
    setCurrentIndex(newIndex);

    // Pause all videos
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0; // Optional: reset to beginning
      }
    });

    // Play the current video
    const currentVideo = videoRefs.current[newIndex];
    if (currentVideo) {
      currentVideo.play().catch((error) => {
        console.log("Video play failed:", error);
      });
    }
  };

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

  const handleUnmute = () => {
    setIsMuted(false);
    setHasInteracted(true);
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = false;
      }
    });
  };

  const handleToggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = newMutedState;
      }
    });
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

  const {
    mutate: likeShorts,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (uuid: string) => {
      const response = await getRequestProtected(
        `shorts/${uuid}/like`,
        token,
        prevRoutes().library
      );
      return response;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast(data?.message, {
          type: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["shorts"],
        });
      } else {
        toast(data?.message, {
          type: "error",
        });
      }
    },
  });

  const { mutate: dislikeShorts } = useMutation({
    mutationFn: async (uuid: string) => {
      const response = await getRequestProtected(
        `shorts/${uuid}/dislike`,
        token,
        prevRoutes().library
      );
      return response;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast(data?.message, {
          type: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["shorts"],
        });
      } else {
        toast(data?.message, {
          type: "error",
        });
      }
    },
  });

  const hasLiked = useMemo(() => {
    if (!user?.id || !shorts?.[currentSlideIndex]?.likesAndViews) {
      return false;
    }

    return shorts?.[currentSlideIndex]?.likesAndViews.some((item) =>
      item.likes?.find((like) => like.user_id === user?.id)
    );
  }, [shorts, currentSlideIndex, user?.id]);

  const hasdiLiked = useMemo(() => {
    if (!user?.id || !shorts?.[currentSlideIndex]?.likesAndViews) {
      return false;
    }

    return shorts?.[currentSlideIndex].likesAndViews.some((item) =>
      item?.dislikes?.find((like) => like.user_id === user?.id)
    );
  }, [shorts, currentSlideIndex, user?.id]);

  const lv = shorts?.[currentSlideIndex]?.likesAndViews?.[0];
  if (!shorts || shorts.length === 0) return null;
  if (!shorts?.[currentSlideIndex]) {
    return null;
  }
  return (
    <div className="w-full h-full block md:flex md:justify-center md:items-center relative flex-1 overflow-hidden">
      <div className="block md:flex md:gap-10 overflow-hidden">
        <div className="absolute left-2 z-[22] flex flex-col justify-between h-full">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <h3 className="text-[#FCFCFDB2] text-xl">
                {shorts?.[currentSlideIndex]?.title}
              </h3>
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
          {/* <div className=" mb-0 lg:mb-10 xl:mb-14">
            <button className="flex items-center gap-2 bg-[#05834B] w-full justify-center py-2 rounded-md md:mb-2">
              watch more <ArrowRight />
            </button>
          </div> */}
        </div>
        <div className="relative h-[82.7vh] md:h-[60vw] md:max-h-[600px] w-full md:max-w-[480px] rounded-md z-10">
          {/* Unmute Button - Shows on first load */}
          {!hasInteracted && (
            <button
              onClick={handleUnmute}
              className="absolute top-4 right-4 z-30 bg-black/50 text-white px-4 py-2 rounded-full hover:bg-black/70 transition-colors"
            >
              🔇 Tap to Unmute
            </button>
          )}

          {/* Mute Toggle Button - Shows after first interaction */}
          {hasInteracted && (
            <button
              onClick={handleToggleMute}
              className="absolute top-4 right-4 z-30 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          )}
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={handleSlideChange}
            direction={"vertical"}
            modules={[Pagination]}
            className="h-full w-full"
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            {shorts?.map((short: ShortsType, index: number) => (
              <SwiperSlide className="h-full w-full" key={index}>
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  className="h-full w-full object-cover"
                  autoPlay={index === 0} // Only autoplay first video
                  loop
                  muted={isMuted}
                  playsInline
                  controls={false}
                  src={short.upload}
                ></video>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="absolute md:static right-5 bottom-0 z-[22] flex flex-col gap-10 justify-end mb-5">
          <div
            onClick={() => likeShorts(shorts?.[currentSlideIndex]?.uuid)}
            className="flex flex-col items-center gap-2"
          >
            <LikeIcon
              className={`w-10 h-10 ${
                hasLiked ? " text-[#05834B]" : "text-[#FCFCFDB2]"
              }`}
            />
            <p>{lv?.likes?.length || 0}</p>
          </div>
          <div
            className="flex flex-col items-center gap-2"
            onClick={() => dislikeShorts(shorts?.[currentSlideIndex]?.uuid)}
          >
            <DislikeIcon
              className={`w-10 h-10 ${
                hasdiLiked ? " text-[#05834B]" : "text-[#FCFCFDB2]"
              }`}
            />
            <p>{lv?.dislikes?.length || 0}</p>
          </div>
          <div onClick={() => setCommentOpen((prev: any) => !prev)}>
            <CommentShortsIcon className="w-10 h-10" />
          </div>
          <div>
            <ShareShortsIcon className="w-10 h-10" />
          </div>
          <div className="overflow-hidden w-10 h-10 rounded-full">
            <Image
              src={shorts?.[currentSlideIndex]?.user.photo as string}
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
        <div className="flex flex-col gap-5 justify-center ml-5">
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
          <div className="flex justify-between ">
            <span className="py-2 px-4 text-lg flex gap-2">
              <p>{shorts?.[currentSlideIndex]?.comments?.length}</p>{" "}
              <p>Comments </p>
            </span>

            <p
              onClick={() => setCommentOpen(false)}
              className="py-2 px-4 cursor-pointer w-full flex justify-end"
            >
              X
            </p>
          </div>
          <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
            {shorts?.[currentSlideIndex]?.comments?.map(
              (comment: any, idx: number) => (
                <ShortsComments key={idx} comment={comment} />
              )
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
//<ShortsComments key={idx} />
