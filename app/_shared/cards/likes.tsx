"use client";

import { parseArray } from "@/helpers/parsArray";
import { ColouredThumbsupSolid, Dot, EyeFilled, HeartTwoTone, ThumbsSolid } from "../icons/icons";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useMemo } from "react";

const Likes = ({ likesNViews,queryKey,uid }: { likesNViews: any ,queryKey?:string|undefined,uid?:string}) => {
  const { user, token } = useSelector
  (selectAuthState);
  const isLiked = useMemo(()=>{
    return parseArray(likesNViews?.likes).some((value) => {
      return value?.user_id === user?.id;
    });
  },[])
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
      getRequestProtected(`/comics/${uid}/subscribe`, token, pathname),
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
  console.log(likesNViews)
  let views = parseArray(likesNViews?.views).length;
  let likes = parseArray(likesNViews?.likes).length;
  return (
    <div className="flex items-center gap-[9px]">
      <div className="flex items-center gap-[2.5px] text-sm font-light">
        <EyeFilled /> {views}
      </div>
      <Dot />
      <div className="flex items-center gap-[2.5px] text-sm font-light">
        <HeartTwoTone /> 1k
      </div>
      <Dot />
      <div
        className={`flex items-center gap-[2.5px] text-sm font-light hover:cursor-pointer ${
          isLiked ? "text-[#05834B]" : ""
        } `}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          likeComic();
          console.log(likesNViews);
        }}
      >
        {isLiked ? <ColouredThumbsupSolid /> : <ThumbsSolid />} {likes}
      </div>
    </div>
  );
};

export default Likes;
