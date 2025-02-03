"use client";
import { Dot } from "@/app/_shared/icons/icons";
import { formatDate } from "@/helpers/parsArray";
import { ComicComment } from "@/helpers/types";
import Image from "next/image";
import React from "react";

const Comment = ({data,username,photo,comment,createdAt}:{data:ComicComment,username?:string,photo?:string,comment?:string,createdAt?:string}) => {

  return (
    <div className="flex items-center gap-4">
      <div className="w-[30px] h-[30px] rounded-lg overflow-hidden">
        <img
          src={photo ? photo : data?.user?.photo}
          width={30}
          height={30}
          alt={"title"}
          style={{
            objectFit: "cover",
            maxWidth: "100%",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <div>
        <div className="flex items-center mt-5 gap-2 text-[#969AA0]">
          <span>{username ? username : data?.user?.username}</span>
          <Dot />
          <span className="text-xs">
            {formatDate(
              createdAt ? createdAt : data?.createdAt || data?.created_at
            )}
          </span>
        </div>
        <div className="break-words break-all overflow-y-auto text-ellipsis max-w-full">
          <p className="font-semibold text-[#c9c9de] break-words overflow-y-auto text-ellipsis max-w-full">
            {comment ? comment : data?.comment}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
// `/static/images/cards/comic0.png`;
