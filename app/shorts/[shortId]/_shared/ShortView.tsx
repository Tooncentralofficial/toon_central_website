"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CommentShortsIcon,
  DislikeIcon,
  LikeIcon,
  ShareShortsIcon,
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

interface ShortViewProps {
  shortId: string;
  data: any;
  isLoading: boolean;
  queryKey: string;
}

export default function ShortView({
  shortId,
  data,
  isLoading,
  queryKey,
}: ShortViewProps) {
  const { user, token } = useSelector(selectAuthState);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
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

  // Fetch comments
  const {
    data: shortCommentsdata,
    isLoading: shortCommentsLoading,
    isFetching: shortCommentsFetching,
  } = useQuery({
    queryKey: [`short-comments`, shortId, shortComments.pagination.currentPage],
    queryFn: () =>
      getRequestProtected(
        `/short-comments/${shortId}?page=${shortComments.pagination.currentPage}&limit=10`,
        token || "",
        pathname
      ),
    enabled: !!shortId && !!token,
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

  // Like mutation
  const { mutate: likeShorts } = useMutation({
    mutationKey: ["like_short", data?.uuid],
    mutationFn: async (uuid: string) =>
      getRequestProtected(
        `shorts/${uuid}/like`,
        token || "",
        prevRoutes().library
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: ["short-comments", shortId] });
    },
    onError: () => {
      toast("Failed to like short", { type: "error" });
    },
  });

  // Dislike mutation
  const { mutate: dislikeShorts } = useMutation({
    mutationKey: ["dislike_short", data?.uuid],
    mutationFn: async (uuid: string) =>
      getRequestProtected(`shorts/${uuid}/dislike`, token || "", pathname),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: ["short-comments", shortId] });
    },
    onError: () => {
      toast("Failed to dislike short", { type: "error" });
    },
  });

  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      setHasInteracted(true);
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

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

  // Check if user has liked/disliked
  const hasLiked = React.useMemo(() => {
    if (!data?.likesAndViews || !user?.id) return false;
    return data.likesAndViews.some((item: any) =>
      item?.likes?.find((like: any) => like.user_id === user.id)
    );
  }, [data, user?.id]);

  const hasdiLiked = React.useMemo(() => {
    if (!data?.likesAndViews || !user?.id) return false;
    return data.likesAndViews.some((item: any) =>
      item?.dislikes?.find((like: any) => like.user_id === user.id)
    );
  }, [data, user?.id]);

  const lv = data?.likesAndViews?.[0];

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col gap-4 w-full max-w-4xl">
          <Skeleton className="w-full h-[600px] rounded-lg" />
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="w-full flex justify-center items-start mt-6">
      <div className="w-full max-w-4xl flex gap-6">
        {/* Main Video Section */}
        <div className="flex-1">
          <div className="relative h-[82.7vh] md:h-[60vw] md:max-h-[600px] w-full rounded-md overflow-hidden bg-black">
            {/* Unmute Button */}
            {!hasInteracted && (
              <button
                onClick={handleUnmute}
                className="absolute top-4 right-4 z-30 bg-black/50 text-white px-4 py-2 rounded-full hover:bg-black/70 transition-colors"
              >
                🔇 Tap to Unmute
              </button>
            )}

            {/* Mute Toggle Button */}
            {hasInteracted && (
              <button
                onClick={handleToggleMute}
                className="absolute top-4 right-4 z-30 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
              >
                {isMuted ? "🔇" : "🔊"}
              </button>
            )}

            <video
              ref={videoRef}
              className="h-full w-full object-contain"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              controls={false}
              src={data.upload}
            />
          </div>

          {/* Title and Description */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-white mb-2">{data.title}</h1>
            {data.description && (
              <p className="text-gray-300 mb-4">{data.description}</p>
            )}

            {/* Creator Info */}
            {data.user && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={data.user.photo || "/static/images/auth_bkg.png"}
                    alt={data.user.username || "Creator"}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {data.user.username || "Creator"}
                  </p>
                  {data.user.first_name && data.user.last_name && (
                    <p className="text-gray-400 text-sm">
                      {data.user.first_name} {data.user.last_name}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Actions */}
        <div className="hidden md:flex flex-col gap-6 items-center">
          <div
            onClick={() => data?.uuid && likeShorts(data.uuid)}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <LikeIcon
              className={`w-10 h-10 ${
                hasLiked ? "text-[#05834B]" : "text-[#FCFCFDB2]"
              }`}
            />
            <p className="text-white text-sm">{lv?.likes?.length || 0}</p>
          </div>
          <div
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => data?.uuid && dislikeShorts(data.uuid)}
          >
            <DislikeIcon
              className={`w-10 h-10 ${
                hasdiLiked ? "text-[#05834B]" : "text-[#FCFCFDB2]"
              }`}
            />
            <p className="text-white text-sm">{lv?.dislikes?.length || 0}</p>
          </div>
          <div
            onClick={() => setCommentsOpen((prev) => !prev)}
            className="cursor-pointer"
          >
            <CommentShortsIcon className="w-10 h-10 text-[#FCFCFDB2]" />
            <p className="text-white text-sm text-center mt-2">
              {shortComments.pagination.total || 0}
            </p>
          </div>
          <div className="cursor-pointer">
            <ShareShortsIcon className="w-10 h-10 text-[#FCFCFDB2]" />
          </div>
          {data.user && (
            <div className="overflow-hidden w-10 h-10 rounded-full">
              <Image
                src={data.user.photo || "/static/images/auth_bkg.png"}
                width={50}
                height={50}
                alt={data.user.username || "Creator"}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Comments Sidebar - Desktop */}
        <AnimatePresence>
          {commentsOpen && (
            <motion.div
              className="hidden md:flex flex-col border-l border-foreground-300 h-[600px] w-80"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "20rem", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
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
                <div className="flex-1 overflow-y-auto no-scrollbar mb-4">
                  {shortCommentsLoading &&
                  shortComments.comments.length === 0 ? (
                    <div className="text-center text-gray-400 animate-pulse">
                      Loading comments...
                    </div>
                  ) : shortComments.comments.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {shortComments.comments.map((comment: any, i: number) => (
                        <ShortsComments
                          key={comment.id || i}
                          shortId={shortId}
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
                <div>
                  <ShortCommentInput shortId={shortId} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
              <ShortsComments key={comment.id || idx} comment={comment} />
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
            <ShortCommentInput shortId={shortId} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
