"use client";
import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getRequest, getRequestProtected } from "../../utils/queries/requests";
import ShortsCard from "./shortsCard";
import H2SectionTitle from "../../_shared/layout/h2SectionTitle";
import { motion } from "framer-motion";

// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/pagination";
import "../shorts.css";
import Image from "next/image";
import ShortsComments from "./shortscomments";
import ShortCommentInput from "./shortsCommentInut";
import { ShortsResponse, ShortsType } from "@/helpers/types";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { prevRoutes } from "@/lib/session/prevRoutes";

export interface ShortsInfiniteData {
  pages: ShortsResponse[];
  pageParams: number[];
}

export default function ShortsContent() {
  const { token } = useSelector(selectAuthState);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
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
  const [commentsOpen, setCommentsOpen] = useState(false);

  const {
    data,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["shorts"],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getRequest(
        `home/shorts-carousel?page=${pageParam}&limit=10`
      );

      return {
        shorts: res?.data?.shorts || [],
        nextPage: res?.data?.nextPage || null,
      };
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    enabled: !!token,
  });

  // Safely extract shorts with proper null checks
  const pages = data?.pages ?? [];
  const shorts = pages.flatMap((p) => p?.shorts ?? []);
  const currentShort = shorts[currentIndex] ?? null;

  const handleSlideChange = async (swiper: any) => {
    const index = swiper.activeIndex;
    const shortsLength = shorts.length;
    const nearEnd = shortsLength > 0 && index >= shortsLength - 2;

    if (nearEnd && hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  };

  const prevShortIdRef = useRef<string | null>(null);

  const {
    data: shortCommentsdata,
    isLoading: shortCommentsLoading,
    isFetching: shortCommentsFetching,
  } = useQuery({
    queryKey: [
      `short-comments`,
      currentShort?.id,
      shortComments.pagination.currentPage,
    ],
    queryFn: () =>
      getRequestProtected(
        `/short-comments/${currentShort?.id}?page=${shortComments.pagination.currentPage}&limit=5`,
        token,
        prevRoutes().library
      ),
    enabled: !!currentShort?.id && !!token,
  });

  useEffect(() => {
    if (shortCommentsdata?.data) {
      setShortComments((prev) => ({
        comments:
          shortCommentsdata.data.pagination.currentPage === 1
            ? shortCommentsdata.data.short_comments || []
            : [
                ...prev.comments,
                ...(shortCommentsdata.data.short_comments || []),
              ],
        pagination: shortCommentsdata.data.pagination || {
          total: 0,
          count: 0,
          perPage: 10,
          currentPage: 1,
          totalPages: 1,
        },
      }));
    }
  }, [shortCommentsdata]);

  useEffect(() => {
    // Only reset if the short ID actually changed
    if (prevShortIdRef.current !== currentShort?.id) {
      setShortComments({
        comments: shortCommentsdata?.data?.short_comments || [],
        pagination: shortCommentsdata?.data?.pagination || {
          total: 0,
          count: 0,
          perPage: 10,
          currentPage: 1,
          totalPages: 1,
        },
      });
      prevShortIdRef.current = currentShort?.id ?? null;
    }
  }, [currentShort?.id, shortCommentsdata]);

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

  // Show loading state while data is being fetched
  if (isLoading || !isSuccess) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500 animate-pulse">
          Loading shorts...
        </div>
      </div>
    );
  }

  // Show empty state if no shorts available
  if (!shorts || shorts.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500">No shorts available</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex shorts-content-wrapper">
      <ShortsCard
        shortComment={shortComments}
        shorts={shorts}
        featured={true}
        index={0}
        setCommentOpen={setCommentsOpen}
        commentsOpen={commentsOpen}
        setCurrentIndex={setCurrentIndex}
      />
      <motion.div
        className="border-l-1 border-foreground-300 border-t-1 hidden md:flex flex-col h-[38rem]"
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: commentsOpen ? "26rem" : "0rem",
          opacity: commentsOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col p-3 gap-5 flex-1">
            <div className="flex justify-between text-sm">
              <span>{shortComments?.pagination?.total ?? 0} Comments</span>
              <span
                onClick={() => setCommentsOpen(false)}
                className="cursor-pointer"
              >
                x
              </span>
            </div>
            {shortCommentsLoading && shortComments?.comments?.length === 0 ? (
              <div className="text-center text-sm text-gray-500 animate-pulse">
                Loading comments...
              </div>
            ) : (
              <div className="overflow-y-auto no-scrollbar flex flex-col p-3 gap-5 h-[30rem]">
                {shortComments?.comments?.map((item: any, i: number) => (
                  <ShortsComments
                    key={item.id || i}
                    shortId={currentShort?.id}
                    comment={item}
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
            )}
          </div>
          <div>
            <ShortCommentInput shortId={currentShort?.id} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
