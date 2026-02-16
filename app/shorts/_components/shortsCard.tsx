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
  MuteIcon,
  ShareShortsIcon,
  UnmuteIcon,
} from "../../_shared/icons/icons";
import Likes from "../../_shared/cards/likes";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
// import { Autoplay } from "swiper/modules";
//@ts-ignore
import "swiper/css";
//@ts-ignore
import "swiper/css/pagination";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import ShortsComments from "./shortscomments";
import { shortLike, ShortsType } from "@/helpers/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { prevRoutes } from "@/lib/session/prevRoutes";
import { toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";
import ShareModal from "@/app/_shared/modals/shareModal";
import { PUBLICURL } from "@/envs";

interface ShortsCardProps {
  shorts: ShortsType[];
  featured: boolean;
  index: number;
  setCommentOpen: (open: any) => void;
  commentsOpen: boolean;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  shortComment: any;
  fetchNextPage: () => Promise<any>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export default function ShortsCard({
  shorts,
  featured,
  index,
  setCommentOpen,
  commentsOpen,
  setCurrentIndex,
  shortComment,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: ShortsCardProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { user, token } = useSelector(selectAuthState);

  const [likes, setLikes] = useState<shortLike[]>([]);
  const photo = user?.photo || "";

  const swiperRef: any = useRef(null);
  const scrollYRef = useRef(0);

  // Lock body scroll on mobile to prevent page scroll interference
  useEffect(() => {
    // Check if mobile device
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Save current scroll position
      scrollYRef.current = window.scrollY;

      // Lock body scroll on mobile - use a less aggressive approach that doesn't interfere with Swiper
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;
      const originalHeight = document.body.style.height;

      // Lock body scroll - this prevents page scroll but Swiper can still handle touches
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.classList.add("shorts-active");

      // Cleanup: restore scroll when component unmounts
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        document.body.style.height = originalHeight;
        document.body.classList.remove("shorts-active");
        window.scrollTo(0, scrollYRef.current);
      };
    }
  }, []);

  // Handle video playback when slide changes
  const handleSlideChange = async (swiper: any) => {
    const newIndex = swiper.activeIndex;
    setCurrentSlideIndex(newIndex);
    setCurrentIndex(newIndex);

    // Check if we need to fetch more shorts
    const shortsLength = Array.isArray(shorts) ? shorts.length : 0;
    const nearEnd = shortsLength > 0 && newIndex >= shortsLength - 2; // Trigger when less than 2 shorts remaining

    if (nearEnd && hasNextPage && !isFetchingNextPage) {
      console.log(
        "Fetching next page - Index:",
        newIndex,
        "Length:",
        shortsLength,
        "HasNext:",
        hasNextPage
      );
      const nextPage = await fetchNextPage();
      console.log(nextPage);
      // Update Swiper to recognize new slides after fetching
      setTimeout(() => {
        if (swiperRef.current && !swiperRef.current.destroyed) {
          swiperRef.current.update();
          swiperRef.current.updateSlides();
          swiperRef.current.updateSize();
        }
      }, 100);
    }

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

    // Reset pause state when slide changes
    setIsPaused(false);
  };

  // Update Swiper when shorts array changes (new shorts loaded)
  useEffect(() => {
    if (
      swiperRef.current &&
      !swiperRef.current.destroyed &&
      Array.isArray(shorts) &&
      shorts.length > 0
    ) {
      swiperRef.current.update();
      swiperRef.current.updateSlides();
      swiperRef.current.updateSize();
    }
  }, [Array.isArray(shorts) ? shorts.length : 0]);

  const handleTogglePause = () => {
    const currentVideo = videoRefs.current[currentSlideIndex];
    if (currentVideo) {
      if (isPaused) {
        currentVideo.play().catch((error) => {
          console.log("Video play failed:", error);
        });
        setIsPaused(false);
      } else {
        currentVideo.pause();
        setIsPaused(true);
      }
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

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const ArrowCircle = ({
    type,
    disabled,
  }: {
    type: "left" | "right";
    disabled?: boolean;
  }) => {
    return (
      <div
        onClick={
          disabled ? undefined : type === "left" ? handlePrev : handleNext
        }
        className={` ${
          type === "left" ? "left-[-60px]" : "right-[-60px]"
        } rounded-[50%] h-10 w-10 bg-[#2E3747] hidden md:inline-grid place-items-center z-10 ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-[#3a4558]"
        } transition-all`}
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
        queryClient.invalidateQueries({
          queryKey: ["shorts-home"],
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
        queryClient.invalidateQueries({
          queryKey: ["shorts-home"],
        });
      } else {
        toast(data?.message, {
          type: "error",
        });
      }
    },
  });

  // Get creator ID from current short
  const creatorId = shorts?.[currentSlideIndex]?.user?.id;

  // Check follow status
  const {
    data: isFollowingdata,
    isLoading: isCheckingFollow,
    isFetching: isFetchingFollow,
  } = useQuery({
    queryKey: ["isfollowing", creatorId],
    queryFn: () =>
      getRequestProtected(
        `profile/${creatorId}/check-follow-status`,
        token,
        pathname
      ),
    enabled: !!token && !!creatorId && !!user && user.id !== creatorId,
  });
  const isFollowing = isFollowingdata?.data === true;

  // Follow mutation
  const { mutate: follow, isPending: isFollowingPending } = useMutation({
    mutationKey: ["follow", creatorId],
    mutationFn: () =>
      getRequestProtected(`profile/${creatorId}/follow`, token, pathname),
    onSuccess: (response) => {
      if (response?.success) {
        toast(response?.message || "Followed successfully", {
          type: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["isfollowing", creatorId],
        });
      }
    },
    onError: () => {
      toast("Failed to follow", { type: "error" });
    },
  });

  // Unfollow mutation
  const { mutate: unfollow, isPending: isUnfollowingPending } = useMutation({
    mutationKey: ["unfollow", creatorId],
    mutationFn: () =>
      getRequestProtected(`profile/${creatorId}/unfollow`, token, pathname),
    onSuccess: (response) => {
      if (response?.success) {
        toast(response?.message || "Unfollowed successfully", {
          type: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["isfollowing", creatorId],
        });
      }
    },
    onError: () => {
      toast("Failed to unfollow", { type: "error" });
    },
  });

  // Handle follow/unfollow
  const handleFollow = () => {
    if (!token) {
      toast("Please login to follow", { type: "info" });
      return;
    }
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

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
  if (!Array.isArray(shorts) || shorts.length === 0) return null;
  if (!shorts?.[currentSlideIndex]) {
    return null;
  }

  // Calculate if we're at beginning or end
  const isAtBeginning = currentSlideIndex === 0;
  const isAtEnd =
    Array.isArray(shorts) && currentSlideIndex >= shorts.length - 1;

  return (
    <div className="w-full h-full block md:flex md:justify-center md:items-center relative flex-1 overflow-hidden shorts-card-container">
      <div className="absolute top-2 left-2 z-[22]">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center p-3 md:p-4 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
          aria-label="Go back to previous page"
        >
          <ArrowLeftLong className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
      <div className="block md:flex md:gap-10 overflow-hidden">
        <div className="absolute left-2 z-[22]  flex flex-col justify-end md:justify-between h-full">
          <div className="flex flex-col gap-4 mb-5 md:mb-0">
            <div className="flex gap-3 items-center">
              <h3 className="text-[#FCFCFDB2] text-sm md:text-xl line-clamp-1">
                {shorts?.[currentSlideIndex]?.user?.username}
              </h3>
              {user?.id !== creatorId && (
                <button
                  onClick={handleFollow}
                  disabled={
                    isCheckingFollow ||
                    isFetchingFollow ||
                    isFollowingPending ||
                    isUnfollowingPending
                  }
                  className={`px-3 py-1 rounded-2xl text-xs md:text-base transition-colors ${
                    isFollowing
                      ? "bg-[#475467] text-white"
                      : "bg-[#05834B] text-white hover:bg-[#047a42]"
                  } ${
                    isCheckingFollow ||
                    isFetchingFollow ||
                    isFollowingPending ||
                    isUnfollowingPending
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {isCheckingFollow ||
                  isFetchingFollow ||
                  isFollowingPending ||
                  isUnfollowingPending
                    ? "Loading..."
                    : isFollowing
                    ? "Following"
                    : "Follow"}
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2 ml-0 md:ml-5">
              <h3 className="text-sm md:text-2xl line-clamp-1">
                {shorts?.[currentSlideIndex]?.title}
              </h3>

              <div className="flex gap-3">
                <p className="border-[1px] px-1 py-[0.1rem] md:px-3 md:py-1 border-[#05834BF5] text-xs md:text-base flex items-center justify-center">
                  Comedy
                </p>
                <p className="border-[1px] px-1 py-[0.1rem] md:px-3 md:py-1 border-[#05834BF5] flex items-center justify-center">
                  Shorts
                </p>
                <p className=" text-xs md:text-base border-[1px] px-1 py-[0.1rem] md:px-3 md:   md:py-1 border-[#05834BF5] flex items-center justify-center">
                  {" "}
                  2023
                </p>
              </div>
            </div>
          </div>
          <div className=" mb-12 sm:mb-5 lg:mb-10 xl:mb-20">
            <Link href={`/pubprofile/${shorts?.[currentSlideIndex]?.user.id}`}>
              <button className="flex items-center gap-2 bg-[#05834B] w-full justify-center py-2 rounded-md md:mb-2">
                watch more <ArrowRight />
              </button>
            </Link>
          </div>
        </div>
        <div className="relative h-full min-h-[400px] md:h-[60vw] md:max-h-[600px] md:min-h-0 w-full md:max-w-[480px] rounded-md z-10 overflow-hidden bg-black shorts-swiper-container">
          {/* Unmute Button - Shows on first load */}
          {!hasInteracted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUnmute();
              }}
              className="absolute top-4 right-4 z-30 bg-black/50 text-white px-4 py-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <MuteIcon className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Mute Toggle Button - Shows after first interaction */}
          {hasInteracted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleMute();
              }}
              className="absolute top-4 right-4 z-30 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
            >
              {isMuted ? (
                <MuteIcon className="w-5 h-5 text-white " />
              ) : (
                <UnmuteIcon className="w-5 h-5 text-white " />
              )}
            </button>
          )}
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={handleSlideChange}
            direction={"vertical"}
            modules={[Pagination]}
            className="h-full w-full vertical-shorts-swiper"
            style={{
              height: "100%",
              width: "100%",
            }}
            allowTouchMove={true}
            touchRatio={1}
            threshold={5}
          >
            {shorts?.map((short: ShortsType, index: number) => (
              <SwiperSlide
                className="h-full w-full"
                key={`${short.uuid || short.id || index}-${index}`}
              >
                <div
                  className="relative h-full w-full overflow-hidden cursor-pointer"
                  onClick={handleTogglePause}
                >
                  {/* Blurred Background Video Layer */}
                  <video
                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
                    autoPlay={index === 0}
                    loop
                    muted
                    playsInline
                    controls={false}
                    src={short.upload}
                    aria-hidden="true"
                  />
                  {/* Main Video - Centered with full content visible */}
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    className="relative z-10 h-full w-full object-contain"
                    autoPlay={index === 0} // Only autoplay first video
                    loop
                    muted={isMuted}
                    playsInline
                    controls={false}
                    src={short.upload}
                  ></video>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="absolute mb-12 md:static right-5 bottom-0 z-[22] flex flex-col gap-5 md:gap-10 justify-end md:mb-5">
          <div
            onClick={() => likeShorts(shorts?.[currentSlideIndex]?.uuid)}
            className="flex flex-col items-center gap-2"
          >
            <LikeIcon
              className={`w-6 md:w-10 h-6 md:h-10 ${
                hasLiked ? " text-[#05834B]" : "text-[#FCFCFDB2]"
              }`}
            />
            <p className="text-xs md:text-base">{lv?.likes?.length || 0}</p>
          </div>
          <div
            className="flex flex-col items-center gap-2"
            onClick={() => dislikeShorts(shorts?.[currentSlideIndex]?.uuid)}
          >
            <DislikeIcon
              className={`w-6 md:w-10 h-6 md:h-10 ${
                hasdiLiked ? " text-[#05834B]" : "text-[#FCFCFDB2]"
              }`}
            />
            <p className="text-xs md:text-base">{lv?.dislikes?.length || 0}</p>
          </div>
          <div
            className="flex flex-col items-center gap-2"
            onClick={() => setCommentOpen((prev: any) => !prev)}
          >
            <CommentShortsIcon className="w-6 md:w-10 h-6 md:h-10" />
            <p className="text-xs md:text-base">
              {shorts?.[currentSlideIndex]?.comments?.length || 0}
            </p>
          </div>
          <div
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={handleShare}
          >
            <ShareShortsIcon className="w-6 md:w-10 h-6 md:h-10 ml-1" />
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
          <ArrowCircle type="left" disabled={isAtBeginning} />
          <ArrowCircle type="right" disabled={isAtEnd} />
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
          <div className="flex justify-between">
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
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenChange={() => setIsShareModalOpen((prev) => !prev)}
        comicImageUrl={shorts?.[currentSlideIndex]?.coverImage || ""}
        customUrl={`${PUBLICURL || "http://localhost:3000"}/shorts/${
          shorts?.[currentSlideIndex]?.uuid
        }`}
      />
    </div>
  );
}
//<ShortsComments key={idx} />
