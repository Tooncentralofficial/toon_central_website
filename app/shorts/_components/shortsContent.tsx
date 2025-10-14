"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../../utils/queries/requests";
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

interface ShortsContentProps {
  category: string;
  sidebarCollapsed: boolean;
}

export default function ShortsContent({
  category,
  sidebarCollapsed,
}: ShortsContentProps) {
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
  const [shortsData, setShortsData] = useState<any[]>([]);
  const [featuredShorts, setFeaturedShorts] = useState<any[]>([]);

  const { data: shorts, isLoading } = useQuery({
    queryKey: [`shorts_${category}`],
    queryFn: () => getRequest(`/shorts?category=${category}&page=1&limit=20`),
  });

  const { data: featured, isLoading: featuredLoading } = useQuery({
    queryKey: [`featured_shorts`],
    queryFn: () => getRequest(`/shorts/featured?page=1&limit=5`),
  });

  useEffect(() => {
    if (shorts?.data?.shorts) {
      setShortsData(shorts.data.shorts);
    }
  }, [shorts]);

  useEffect(() => {
    if (featured?.data?.shorts) {
      setFeaturedShorts(featured.data.shorts);
    }
  }, [featured]);
  const [commentsOpen, setCommentsOpen] = useState(false);

  return (
    <div className="w-full h-full flex">
      <ShortsCard
        short={featuredShortsData[0]}
        featured={true}
        index={0}
        setCommentOpen={setCommentsOpen}
      />
      <motion.div
        className="overflow-hidden  border-l-1 border-foreground-300  border-t-1 "
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
              <span>{shortsData.length} Comments</span>
              <span onClick={() => setCommentsOpen(false)}>x</span>
            </div>

            <ShortsComments />
          </div>
          <ShortCommentInput />
        </div>
      </motion.div>
    </div>
  );
}
