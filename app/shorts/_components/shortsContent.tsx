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
  const [totalPages, setTotalPages] = useState<number>(0);

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
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["shorts"],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const res = await getRequest(
          `home/shorts-carousel?page=${pageParam}&limit=10`
        );

        const pagination = res?.data?.pagination;
        const current = pagination?.currentPage ?? 1;
        const total = pagination?.totalPages ?? 1;
        setTotalPages(total);
        const nextPage =
          current && total && current < total ? current + 1 : null;
        console.log("@@nextPage", nextPage);
        // Ensure consistent return structure even if API response is malformed
        return {
          shorts: Array.isArray(res?.data?.shorts) ? res.data.shorts : [],
          nextPage,
        };
      } catch (error) {
        // Return empty structure on error to prevent crashes
        console.error("Error fetching shorts:", error);
        return {
          shorts: [],
          nextPage: null,
        };
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      console.log("@@allPages", allPages, "@@lastPage", lastPage);
      const nextPage = allPages?.length ? allPages?.length + 1 : 1;
      // Return nextPage if available, otherwise undefined to stop fetching
      return nextPage;
    },
    enabled: !!token,
  });

  console.log("@@totalPages", totalPages);

  // Safely extract shorts with proper null checks
  const pages = Array.isArray(data?.pages) ? data.pages : [];
  const shorts = Array.isArray(pages)
    ? pages.flatMap((p) => (p && Array.isArray(p.shorts) ? p.shorts : []))
    : [];
  const currentShort =
    Array.isArray(shorts) && shorts.length > 0
      ? shorts[currentIndex] ?? null
      : null;

  const handleSlideChange = async (swiper: any) => {
    const index = swiper.activeIndex;
    const shortsLength = Array.isArray(shorts) ? shorts.length : 0;
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
  if (isLoading || !isSuccess || (isFetching && shorts.length === 0)) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500 animate-pulse">
          Loading shorts...
        </div>
      </div>
    );
  }

  // Show empty state if no shorts available
  if (!Array.isArray(shorts) || shorts.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500">No shorts available</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex relative shorts-content-wrapper">
      <ShortsCard
        shortComment={shortComments}
        shorts={shorts}
        featured={true}
        index={0}
        setCommentOpen={setCommentsOpen}
        commentsOpen={commentsOpen}
        setCurrentIndex={setCurrentIndex}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
      <motion.div
        className="hidden md:flex flex-col absolute top-0 right-0 z-10 h-screen overflow-hidden bg-[#1A202C] border-l border-slate-600/50"
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
        <div className="flex flex-col h-full min-w-0">
          {/* Header */}
          <div className="flex justify-between items-center py-3 px-4 border-b border-slate-700/40">
            <span className="text-[#FCFCFD] font-medium">
              {shortComments?.pagination?.total ?? 0} Comments
            </span>
            <button
              type="button"
              onClick={() => setCommentsOpen(false)}
              className="rounded-full p-1.5 hover:bg-white/10 transition-colors text-slate-400 hover:text-[#FCFCFD]"
              aria-label="Close comments"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Comments list */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col p-4 gap-5">
            {shortCommentsLoading && shortComments?.comments?.length === 0 ? (
              <div className="text-center text-sm text-slate-400 animate-pulse py-8">
                Loading comments...
              </div>
            ) : !shortComments?.comments?.length ? (
              <div className="text-slate-400 text-sm text-center py-8">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <>
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
                    className="text-sm text-[#05834B] hover:text-[#05834B]/80 disabled:opacity-50 py-2"
                  >
                    {shortCommentsFetching
                      ? "Loading..."
                      : "Load more comments"}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Input footer */}
          <div className="border-t border-slate-700/50 px-4 py-3">
            <ShortCommentInput shortId={currentShort?.id} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
