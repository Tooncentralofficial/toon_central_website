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
  const {token} = useSelector(selectAuthState)
  const featuredShortsData = [
    // Mock featured data with stock images
    {
      id: 1,
      uuid: "featured-1",
      title: "Exploring the Forest",
      description:
        "Join us on an enchanting adventure through the lush green forest and discover hidden secrets.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // stock image URL
      likesAndViews: {
        likes: [{ id: 1 }, { id: 2 }],
        views: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
      },
      favourites: [],
    },
    {
      id: 2,
      uuid: "featured-2",
      title: "City Lights at Night",
      description:
        "Experience the nightlife of the city as the lights shimmer and stories unfold.",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
      likesAndViews: {
        likes: [{ id: 1 }],
        views: [{ id: 1 }, { id: 2 }],
      },
      favourites: [],
    },
    {
      id: 3,
      uuid: "featured-3",
      title: "Mountains and Beyond",
      description: "Climb the tallest peaks and witness the world from above.",
      image: "https://images.unsplash.com/photo-1464820453369-31d2c0b651af",
      likesAndViews: {
        likes: [{ id: 1 }, { id: 2 }, { id: 3 }],
        views: [{ id: 1 }],
      },
      favourites: [],
    },
    {
      id: 4,
      uuid: "featured-4",
      title: "Desert Mirage",
      description:
        "Walk through the sands and uncover the mystery of the everlasting dunes.",
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      likesAndViews: {
        likes: [],
        views: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
      favourites: [],
    },
    {
      id: 5,
      uuid: "featured-5",
      title: "Ocean Depths",
      description:
        "Dive into the blue and find the unexpected wonders that lie beneath the surface.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      likesAndViews: {
        likes: [{ id: 1 }],
        views: [{ id: 1 }],
      },
      favourites: [],
    },
  ];
  const [shortsData, setShortsData] = useState<ShortsType[]>([]);
  const [page, setPage] = useState<number>(1);
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
 

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
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
      getNextPageParam: (lastPage) => lastPage?.nextPage,
    });

  const pages = data?.pages || [];
  const shorts = pages.flatMap((p) => p?.shorts);
  const handleSlideChange = async (swiper: any) => {
    const index = swiper.activeIndex;

    const nearEnd = index >= shorts?.length - 2;

    if (nearEnd && hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  };
  const prevShortIdRef = useRef(shorts[currentIndex]?.id);
  const { data: shortCommentsdata, isLoading: shortCommentsLoading, isFetching: shortCommentsFetching } = useQuery(
    {
      queryKey: [`short-comments`, shorts[currentIndex]?.id, shortComments.pagination.currentPage ],
      queryFn: () =>
        getRequestProtected(
          `/short-comments/${shorts[currentIndex]?.id}?page=${shortComments.pagination.currentPage}&limit=5`,
          token,
          prevRoutes().library
        ),
      enabled: !!shorts[currentIndex]?.id,
    }
  );

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
    if (prevShortIdRef.current !== shorts[currentIndex]?.id) {
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
      prevShortIdRef.current = shorts[currentIndex]?.id;
    }
  }, [shorts, currentIndex]); 
const handleLoadMore = () => {
  if (
    shortComments?.pagination.currentPage < shortComments.pagination.totalPages
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

  const [commentsOpen, setCommentsOpen] = useState(false);

  return (
    <div className="w-full h-full flex">
      <ShortsCard
        shorts={shorts}
        featured={true}
        index={0}
        setCommentOpen={setCommentsOpen}
        commentsOpen={commentsOpen}
        setCurrentIndex={setCurrentIndex}
      />
      <motion.div
        className="  border-l-1 border-foreground-300  border-t-1  hidden md:flex flex-col h-[38rem]"
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
          <div className="flex flex-col p-3 gap-5 flex-1 ">
            <div className="flex justify-between text-sm">
              <span>{shortComments?.pagination?.total} Comments</span>
              <span onClick={() => setCommentsOpen(false)}>x</span>
            </div>
            {shortCommentsLoading && shortComments?.comments?.length === 0 ? (
              <div className="text-center text-sm text-gray-500 animate-pulse ">
                Loading comments...
              </div>
            ) : (
              <div className="overflow-y-auto no-scrollbar  flex flex-col p-3 gap-5 h-[30rem]">
                {shortComments?.comments?.map((item: any, i: number) => (
                  <ShortsComments
                    key={item.id || i}
                    shortId={shorts[currentIndex]?.id}
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
            <ShortCommentInput shortId={shorts[currentIndex]?.id} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
