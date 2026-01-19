"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Button, Skeleton, useDisclosure } from "@nextui-org/react";
import BackButton from "@/app/_shared/layout/back";
import {
  ShareIcon,
  EyeFilled,
  HeartTwoTone,
  ColouredThumbsupSolid,
} from "@/app/_shared/icons/icons";
import ShareModal from "@/app/_shared/modals/shareModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";

interface ProfileHeaderProps {
  data: any;
  isLoading: boolean;
  userid: string;
  queryKey: string;
}

const ProfileHeader = ({
  data,
  isLoading,
  userid,
  queryKey,
}: ProfileHeaderProps) => {
  console.log("@@data", data);
  const { onClose, onOpen, isOpen, onOpenChange } = useDisclosure();
  const { user, token } = useSelector(selectAuthState);
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const creatorId = data?.id;
  console.log("@@creatorId", creatorId);
  const {
    data: isFollowingdata,
    isLoading: isCheckingFollow,
    isFetching: isFetchingFollow,
  } = useQuery({
    queryKey: ["isfollowing", userid, creatorId],
    queryFn: () =>
      getRequestProtected(
        `profile/${creatorId}/check-follow-status`,
        token,
        pathname
      ),
    enabled: !!token && !!creatorId && !!user && user.id !== creatorId,
  });
  const isFollowing = isFollowingdata?.data === true;

  const { mutate: follow, isPending: isFollowingPending } = useMutation({
    mutationKey: ["follow", creatorId],
    mutationFn: () =>
      getRequestProtected(`profile/${creatorId}/follow`, token, pathname),
    onSuccess: (response) => {
      if (response?.success) {
        toast(response?.message || "Followed successfully", {
          toastId: `follow-${creatorId}`,
          type: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["isfollowing", userid, creatorId],
        });
      }
    },
    onError: (error: any) => {
      toast("Failed to follow", {
        toastId: `follow-${creatorId}`,
        type: "error",
      });
    },
  });

  const { mutate: unfollow, isPending: isUnfollowingPending } = useMutation({
    mutationKey: ["unfollow", creatorId],
    mutationFn: () =>
      getRequestProtected(`profile/${creatorId}/unfollow`, token, pathname),
    onSuccess: (response) => {
      if (response?.success) {
        toast(response?.message || "Unfollowed successfully", {
          toastId: `unfollow-${creatorId}`,
          type: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["isfollowing", userid, creatorId],
        });
      }
    },
    onError: (error: any) => {
      toast("Failed to unfollow", {
        toastId: `unfollow-${creatorId}`,
        type: "error",
      });
    },
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data) return { views: 0, likes: 0, subscribers: 0 };

    // Calculate total views from comics and shorts
    // Sum views from all comics and shorts if available
    let totalViews = 0;
    let totalLikes = 0;

    if (data.comics) {
      data.comics.forEach((comic: any) => {
        if (comic.likesAndViews?.views) {
          totalViews += Array.isArray(comic.likesAndViews.views)
            ? comic.likesAndViews.views.length
            : comic.likesAndViews.views;
        }
        if (comic.likesAndViews?.likes) {
          totalLikes += Array.isArray(comic.likesAndViews.likes)
            ? comic.likesAndViews.likes.length
            : comic.likesAndViews.likes;
        }
      });
    }

    // Format numbers (100 -> "100", 1000 -> "1k")
    const formatNumber = (num: number) => {
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}k`;
      }
      return num.toString();
    };

    return {
      views: formatNumber(totalViews || 100),
      likes: formatNumber(totalLikes || 1000),
      subscribers: formatNumber(100), // Placeholder - adjust if API provides
    };
  }, [data]);

  // Extract unique genres from comics
  const genres = useMemo(() => {
    if (!data?.comics) return [];
    const genreSet = new Set<string>();

    data.comics.forEach((comic: any) => {
      if (comic.genres && Array.isArray(comic.genres)) {
        comic.genres.forEach((genreItem: any) => {
          if (genreItem?.genre?.name) {
            genreSet.add(genreItem.genre.name);
          } else if (typeof genreItem === "string") {
            genreSet.add(genreItem);
          }
        });
      }
    });

    return Array.from(genreSet);
  }, [data]);

  // Get creator name
  const creatorName = useMemo(() => {
    if (!data) return "";
    return data.username || `${data.first_name} ${data.last_name}` || "Creator";
  }, [data]);

  const handleFollow = () => {
    if (!token) {
      toast("Please login to follow", {
        toastId: "follow-login",
        type: "info",
      });
      return;
    }
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  return (
    <Skeleton
      isLoaded={!isLoading && data !== null}
      className={`${
        (isLoading || data == null) && "h-[400px]"
      } bg-secondary my-10 rounded-lg`}
    >
      <div className="bg-secondary p-4 lg:p-9 rounded-lg relative">
        {/* Back and Share Buttons */}
        <div className="flex justify-between items-start mb-6">
          <BackButton />
          <button
            onClick={onOpen}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
            aria-label="Share profile"
          >
            <ShareIcon />
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Profile Picture */}
          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-2 border-[var(--green100)]">
              <Image
                src={data?.photo || ""}
                alt={creatorName}
                width={160}
                height={160}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 w-full">
            {/* Creator Name with Verified Badge */}
            <div className="flex items-center gap-2 mb-3">
              <h1 className="text-2xl lg:text-4xl font-bold text-white">
                {creatorName}
              </h1>
              {data?.is_official_user === 1 && (
                <div className="flex items-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="#05834B"
                    />
                    <path
                      d="M9 12L11 14L15 10"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Statistics Bar */}
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-1.5">
                <EyeFilled className="w-5 h-5 text-[#9FA6B2]" />
                <span className="text-sm text-white font-medium">
                  {stats.views}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartTwoTone className="w-5 h-5 text-[#9FA6B2]" />
                <span className="text-sm text-white font-medium">
                  {stats.likes}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <ColouredThumbsupSolid className="w-5 h-5 text-[#9FA6B2]" />
                <span className="text-sm text-white font-medium">
                  {stats.subscribers}
                </span>
              </div>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-[#9FA6B2]">{genres.join(", ")}</p>
              </div>
            )}

            {/* Bio/Description */}
            {data?.welcome_note && (
              <div className="mb-6">
                <p className="text-sm text-[#9FA6B2] leading-relaxed">
                  {data.welcome_note}
                </p>
              </div>
            )}

            {/* Follow/Unfollow Button */}
            {user?.id !== creatorId && (
              <div className="mt-4">
                <SolidPrimaryButton
                  onClick={handleFollow}
                  isLoading={
                    isCheckingFollow ||
                    isFetchingFollow ||
                    isFollowingPending ||
                    isUnfollowingPending
                  }
                  className={`w-full lg:w-auto min-w-[120px] ${
                    isFollowing ? "!bg-[#475467]" : ""
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </SolidPrimaryButton>
              </div>
            )}
          </div>
        </div>

        {/* Share Modal */}
        <ShareModal
          isOpen={isOpen}
          onClose={onClose}
          onOpenChange={onOpenChange}
          comicImageUrl={data?.photo || ""}
        />
      </div>
    </Skeleton>
  );
};

export default ProfileHeader;
