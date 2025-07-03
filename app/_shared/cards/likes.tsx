"use client";

import { parseArray } from "@/helpers/parsArray";
import {
  ColoredEyeFilled,
  ColouredThumbsupSolid,
  Dot,
  EyeFilled,
  HeartTwoTone,
  ThumbsSolid,
  ColoredTwotone,
  SmallEyeIcon,
  SmallFaves,
  LikesSmall,
} from "../icons/icons";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useMemo } from "react";

const Likes = ({
  likesNViews,
  queryKey,
  uid,
  favourites,
  small,
}: {
  likesNViews: any;
  queryKey?: string | undefined;
  uid?: string;
  favourites?: string;
  small?: boolean;
}) => {
  const { user, token } = useSelector(selectAuthState);
  const isLiked = useMemo(() => {
    return parseArray(likesNViews?.likes).some((value) => {
      return value?.user_id === user?.id;
    });
  }, [likesNViews]);
  const isViewd = useMemo(() => {
    return parseArray(likesNViews?.views).some((value) => {
      return value?.user_id === user?.id;
    });
  }, [likesNViews]);
  const isFaved = useMemo(() => {
    return parseArray(favourites).some((value) => {
      return value?.user_id === user?.id;
    });
  }, [likesNViews]);
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const { mutate: likeComic, isPending } = useMutation({
    mutationKey: ["like"],
    mutationFn: () =>
      getRequestProtected(`/comics/${uid}/like`, token, pathname),
    onSuccess: (data) => {
      if (data?.success) {
        toast(data?.message, {
          toastId: `toast_${uid}`,
          type: "success",
        });
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        });
        return;
      }
      toast(data?.message, {
        toastId: `toast_${uid}`,
        type: "error",
      });
    },
    onError(error, variables, context) {
      toast("Failed to like", {
        toastId: `toast_${uid}`,
        type: "error",
      });
    },
  });
  const { mutate: favorite } = useMutation({
    mutationKey: ["favorite"],
    mutationFn: () =>
      getRequestProtected(`/comics/${uid}/add-to-favourite`, token, pathname),
    onSuccess: (data) => {
      if (data?.success) {
        toast(data?.message, {
          toastId: `toast_${uid}`,
          type: "success",
        });
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        });
        return;
      }
      toast(data?.message, {
        toastId: `toast_${uid}`,
        type: "error",
      });
    },
    onError(error, variables, context) {
      toast("Failed to add to favourite", {
        toastId: `toast_${uid}`,
        type: "error",
      });
    },
  });
  let views = parseArray(likesNViews?.views).length;
  let likes = parseArray(likesNViews?.likes).length;
  let fav = parseArray(favourites).length;

  return (
    <div
      className={`flex items-center gap-[9px]  ${
        small ? "gap-2" : "gap-[9px]"
      } `}
    >
      <div
        className={`flex items-center gap-[2.5px] text-xs font-light cursor-pointer ${
          isViewd ? "text-[#05834B]" : ""
        }`}
      >
        {isViewd ? (
          <ColoredEyeFilled />
        ) : small ? (
          <SmallEyeIcon />
        ) : (
          <EyeFilled />
        )}
        {views}
      </div>
      <Dot />
      <div
        className={`flex items-center gap-[2.5px] text-xs font-light cursor-pointer ${
          isFaved ? "text-[#05834B]" : ""
        } `}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          favorite();
        }}
      >
        {isFaved ? (
          <ColoredTwotone />
        ) : small ? (
          <SmallFaves />
        ) : (
          <HeartTwoTone />
        )}{" "}
        {fav}
      </div>
      <Dot />
      <div
        className={`flex items-center gap-[2.5px] text-xs font-light hover:cursor-pointer ${
          isLiked ? "text-[#05834B]" : ""
        } `}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          likeComic();
        }}
      >
        {isLiked ? (
          <ColouredThumbsupSolid />
        ) : small ? (
          <LikesSmall />
        ) : (
          <ThumbsSolid />
        )}{" "}
        {likes}
      </div>
    </div>
  );
};

export default Likes;
