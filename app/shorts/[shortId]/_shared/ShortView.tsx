"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CommentShortsIcon,
  DislikeIcon,
  LikeIcon,
  ShareShortsIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MuteIcon,
  UnmuteIcon,
} from "@/app/_shared/icons/icons";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import ShortsComments from "@/app/shorts/_components/shortscomments";
import ShortCommentInput from "@/app/shorts/_components/shortsCommentInut";
import { Skeleton } from "@nextui-org/react";
import { prevRoutes } from "@/lib/session/prevRoutes";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/pagination";
import "../../shorts.css";
import { ShortsType } from "@/helpers/types";

interface ShortViewProps {
  shortId: string;
  data: any;
  isLoading: boolean;
  queryKey: string;
  shorts: ShortsType[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  fetchNextPage: () => Promise<any>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  shortsLoading: boolean;
}

export default function ShortView({
  shortId,
  data,
  isLoading,
  queryKey,
  shorts,
  currentIndex,
  setCurrentIndex,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  shortsLoading,
}: ShortViewProps) {
  const { user, token } = useSelector(selectAuthState);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const swiperRef = useRef<any>(null);
  const scrollYRef = useRef<number>(0);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shortComments, setShortComments] = useState({
    comments: [],
    pagination: {
      total: 0,
      count: 0,
      perPage: 10,
      currentPage: 1,
      totalPages: 1,
    },
  });

  // Lock body scroll to prevent page scrolling
  useEffect(() => {
    // Save current scroll position
    scrollYRef.current = window.scrollY;

    // Lock body scroll
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
  }, []);

  // Get current short from shorts array
  const currentShort = shorts[currentIndex] || data;
  const currentShortId = currentShort?.uuid || currentShort?.id?.toString() || shortId;

  // Fetch comments for current short
  const {
    data: shortCommentsdata,
    isLoading: shortCommentsLoading,
    isFetching: shortCommentsFetching,
  } = useQuery({
    queryKey: [`short-comments`, currentShortId, shortComments.pagination.currentPage],
    queryFn: () =>
      getRequestProtected(
        `/short-comments/${currentShortId}?page=${shortComments.pagination.currentPage}&limit=10`,
        token || "",
        pathname
      ),
    enabled: !!currentShortId && !!token,
  });

  // Reset comments when short changes
  useEffect(() => {
    setShortComments({
      comments: [],
      pagination: {
        total: 0,
        count: 0,
        perPage: 10,
        currentPage: 1,
        totalPages: 1,
      },
    });
  }, [currentShortId]);

  useEffect(() => {
    if (shortCommentsdata?.data) {
      const pagination = shortCommentsdata.data.pagination;
      const currentPage = pagination?.currentPage || 1;
      setShortComments((prev) => ({
        comments:
          currentPage === 1
            ? shortCommentsdata.data.short_comments || []
            : [
                ...prev.comments,
                ...(shortCommentsdata.data.short_comments || []),
              ],
        pagination: pagination || {
          total: 0,
          count: 0,
          perPage: 10,
          currentPage: 1,
          totalPages: 1,
        },
      }));
    }
  }, [shortCommentsdata]);

  // Handle slide change
  const handleSlideChange = async (swiper: any) => {
    const index = swiper.activeIndex;
    setCurrentIndex(index);
    
    // Fetch next page if near end
    const shortsLength = Array.isArray(shorts) ? shorts.length : 0;
    const nearEnd = shortsLength > 0 && index >= shortsLength - 2;
    
    if (nearEnd && hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }

    // Update video playback
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  // Like mutation
  const { mutate: likeShorts } = useMutation({
    mutationKey: ["like_short", currentShort?.uuid],
    mutationFn: async (uuid: string) =>
      getRequestProtected(
        `shorts/${uuid}/like`,
        token || "",
        prevRoutes().library
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: ["short-comments", currentShortId] });
      queryClient.invalidateQueries({ queryKey: ["shorts"] });
      queryClient.invalidateQueries({ queryKey: ["shorts-home"] });
    },
    onError: () => {
      toast("Failed to like short", { type: "error" });
    },
  });

  // Dislike mutation
  const { mutate: dislikeShorts } = useMutation({
    mutationKey: ["dislike_short", currentShort?.uuid],
    mutationFn: async (uuid: string) =>
      getRequestProtected(`shorts/${uuid}/dislike`, token || "", pathname),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: ["short-comments", currentShortId] });
      queryClient.invalidateQueries({ queryKey: ["shorts"] });
      queryClient.invalidateQueries({ queryKey: ["shorts-home"] });
    },
    onError: () => {
      toast("Failed to dislike short", { type: "error" });
    },
  });

  const handleUnmute = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.muted = false;
      setIsMuted(false);
      setHasInteracted(true);
    }
  };

  const handleToggleMute = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTogglePause = () => {
    const currentVideo = videoRefs.current[currentIndex];
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

  // Check if at beginning or end
  const isAtBeginning = currentIndex === 0;
  const isAtEnd = currentIndex >= shorts.length - 1;

  const ArrowCircle = ({
    type,
    disabled,
  }: {
    type: "left" | "right";
    disabled?: boolean;
  }) => {
    return (
      <div
        onClick={disabled ? undefined : type === "left" ? handlePrev : handleNext}
        className={`flex flex-col items-center gap-2 ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        } transition-all`}
      >
        {type === "left" ? (
          <ArrowUpIcon className="w-10 h-10 text-[#FCFCFDB2]" />
        ) : (
          <ArrowDownIcon className="w-10 h-10 text-[#FCFCFDB2]" />
        )}
      </div>
    );
  };

  // Handle video playback on slide change
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === currentIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentIndex]);

  // Set initial slide when shorts are loaded
  useEffect(() => {
    if (swiperRef.current && shorts.length > 0 && currentIndex >= 0) {
      swiperRef.current.slideTo(currentIndex, 0);
    }
  }, [shorts.length, currentIndex]);

  const handleLoadMore = () => {
    if (
      shortComments?.pagination.currentPage <
      shortComments.pagination.totalPages
    ) {
      setShortComments((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          currentPage: prev.pagination.currentPage + 1,
        },
      }));
    }
  };

  const hasMoreComments =
    shortComments.pagination.currentPage < shortComments.pagination.totalPages;

  // Fetch current short data if not in shorts array or missing detailed data
  const { data: currentShortData } = useQuery({
    queryKey: [`short_${currentShortId}`],
    queryFn: () =>
      getRequestProtected(
        `shorts/${currentShortId}/view`,
        token || "",
        pathname
      ),
    enabled: !!currentShortId && !!token && (!currentShort || (!currentShort.likesAndViews && !currentShort.user)),
  });

  // Use currentShort from array if available, otherwise use fetched data or fallback to data prop
  const displayData = currentShortData?.data || currentShort || data;

  // Check if user has liked/disliked
  const hasLiked = React.useMemo(() => {
    if (!displayData?.likesAndViews || !user?.id) return false;
    return displayData.likesAndViews.some((item: any) =>
      item?.likes?.find((like: any) => like.user_id === user.id)
    );
  }, [displayData, user?.id]);

  const hasdiLiked = React.useMemo(() => {
    if (!displayData?.likesAndViews || !user?.id) return false;
    return displayData.likesAndViews.some((item: any) =>
      item?.dislikes?.find((like: any) => like.user_id === user.id)
    );
  }, [displayData, user?.id]);

  const lv = displayData?.likesAndViews?.[0];

  if (isLoading || shortsLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col gap-4 w-full max-w-4xl">
          <Skeleton className="w-full h-[600px] rounded-lg" />
        </div>
      </div>
    );
  }

  if (!data && shorts.length === 0) {
    return null;
  }

  // Use shorts array if available, otherwise fallback to single data
  const shortsToDisplay = shorts.length > 0 ? shorts : (data ? [data] : []);



  return (
    <div className="w-full h-full flex shorts-content-wrapper " style={{ height: "100vh", overflow: "hidden" }}>
      <div className="w-full h-full block md:flex md:justify-center md:items-center relative flex-1 overflow-hidden shorts-card-container" style={{ height: "100vh" }}>
        <div className="block md:flex md:items-center md:justify-center md:gap-10 overflow-hidden h-full w-full relative">
          {/* Main Video Section with Swiper */}
          {shortsToDisplay.length > 0 ? (
            <div className="relative w-full h-full md:h-[60vw] md:max-h-[600px] md:min-h-0 md:max-w-[480px] rounded-md z-10 overflow-hidden bg-black shorts-swiper-container">
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
            <div className="h-full w-full ">
              <div className="h-full w-full flex items-center justify-center shorts-swiper-wrapper ">
            <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={handleSlideChange}
                direction="vertical"
                modules={[Pagination]}
                className="h-full w-full vertical-shorts-swiper"
                style={{
                  height: "100%",
                  width: "100%",
                }}
                allowTouchMove={true}
                touchRatio={1}
                threshold={5}
                initialSlide={currentIndex}
              >
              {shortsToDisplay.map((short: any, index: number) => (
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
                      autoPlay={index === currentIndex}
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
                      autoPlay={index === currentIndex}
                      loop
                      muted={isMuted}
                      playsInline
                      controls={false}
                      src={short.upload}
                    />
                  </div>
                  </SwiperSlide>
                ))}
                </Swiper>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full md:h-[60vw] md:max-h-[600px] md:min-h-0 md:max-w-[480px] rounded-md z-10 overflow-hidden bg-black shorts-swiper-container cursor-pointer">
              <video
                className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                src={data?.upload}
                aria-hidden="true"
              />
              
              {/* Unmute Button */}
              {!hasInteracted && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnmute();
                  }}
                  className="absolute top-4 right-4 z-30 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <MuteIcon className="w-5 h-5 text-white" />
                </button>
              )}

              {/* Mute Toggle Button */}
              {hasInteracted && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleMute();
                  }}
                  className="absolute top-4 right-4 z-30 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  {isMuted ? (
                    <MuteIcon className="w-5 h-5 text-white" />
                  ) : (
                    <UnmuteIcon className="w-5 h-5 text-white" />
                  )}
                </button>
              )}

              <video
                ref={(el) => {
                  videoRefs.current[0] = el;
                }}
                className="relative z-10 h-full w-full object-contain"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                controls={false}
                src={data?.upload}
              />
          </div>
        )}
          {/* Right Sidebar - Actions */}
          <div className="absolute mb-12 md:static right-5 bottom-0 md:bottom-auto z-[22] flex flex-col gap-5 md:gap-10 justify-end md:justify-center md:mb-5">
            <div
              onClick={() => currentShort?.uuid && likeShorts(currentShort.uuid)}
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
              onClick={() => currentShort?.uuid && dislikeShorts(currentShort.uuid)}
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
              onClick={() => setCommentsOpen((prev) => !prev)}
            >
              <CommentShortsIcon className="w-6 md:w-10 h-6 md:h-10" />
              <p className="text-xs md:text-base">
                {shortComments.pagination.total || 0}
              </p>
            </div>
            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <ShareShortsIcon className="w-6 md:w-10 h-6 md:h-10 ml-1" />
            </div>
            {displayData?.user && (
              <div className="overflow-hidden w-10 h-10 rounded-full">
                <Image
                  src={displayData.user.photo || "/static/images/auth_bkg.png"}
                  width={50}
                  height={50}
                  alt={displayData.user.username || "Creator"}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            )}
          </div>
          <div className="hidden md:flex flex-col gap-5 justify-center ml-5">
            <ArrowCircle type="left" disabled={isAtBeginning} />
            <ArrowCircle type="right" disabled={isAtEnd} />
          </div>
        </div>
      </div>

      {/* Backdrop Overlay - Desktop */}
      <AnimatePresence>
        {commentsOpen && (
          <motion.div
            className="hidden md:block fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setCommentsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Comments Sidebar - Desktop */}
      <AnimatePresence>
        {commentsOpen && (
          <motion.div
            className="hidden md:flex flex-col fixed right-0 top-0 h-screen w-80 bg-[var(--bg-secondary)] border-l border-foreground-300 z-50"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="flex flex-col h-full p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white text-lg font-semibold">
                  {shortComments.pagination.total || 0} Comments
                </span>
                <button
                  onClick={() => setCommentsOpen(false)}
                  className="text-white hover:text-gray-400 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar mb-4 min-h-0">
                {shortCommentsLoading &&
                (!Array.isArray(shortComments?.comments) ||
                  shortComments.comments.length === 0) ? (
                  <div className="text-center text-gray-400 animate-pulse">
                    Loading comments...
                  </div>
                ) : Array.isArray(shortComments?.comments) &&
                  shortComments.comments.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {shortComments.comments.map((comment: any, i: number) => (
                      <ShortsComments
                        key={comment.id || i}
                        shortId={currentShortId}
                        comment={comment}
                      />
                    ))}
                    {hasMoreComments && (
                      <button
                        onClick={handleLoadMore}
                        disabled={shortCommentsFetching}
                        className="text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50 py-2"
                      >
                        {shortCommentsFetching
                          ? "Loading..."
                          : "Load more comments"}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <ShortCommentInput shortId={currentShortId} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Panel - Mobile */}
      <AnimatePresence>
        <motion.div
          className="absolute left-0 bottom-0 z-[23] flex md:hidden flex-col gap-4 bg-[#0D111D] w-full overflow-hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: commentsOpen ? 1 : 0,
            height: commentsOpen ? "70vh" : "1vh",
            y: commentsOpen ? 0 : 20,
          }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="flex justify-between p-4">
            <span className="text-white text-lg flex gap-2">
              <p>{shortComments.pagination.total || 0}</p>
              <p>Comments</p>
            </span>
            <button
              onClick={() => setCommentsOpen(false)}
              className="text-white cursor-pointer text-xl"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
            {shortComments.comments.map((comment: any, idx: number) => (
              <ShortsComments key={comment.id || idx} shortId={currentShortId} comment={comment} />
            ))}
            {hasMoreComments && (
              <button
                onClick={handleLoadMore}
                disabled={shortCommentsFetching}
                className="text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50 py-2"
              >
                {shortCommentsFetching ? "Loading..." : "Load more comments"}
              </button>
            )}
          </div>
          <div className="p-4 border-t border-gray-700">
            <ShortCommentInput shortId={currentShortId} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
