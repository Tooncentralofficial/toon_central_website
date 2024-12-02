"use client";
import { Dot } from "@/app/_shared/icons/icons";
import { formatDate } from "@/helpers/parsArray";
import { ComicComment } from "@/helpers/types";
import Image from "next/image";
import React from "react";

const Comment = ({data}:{data:ComicComment}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-[30px] h-[30px] rounded-lg overflow-hidden">
        <img
          src={data?.user?.photo}
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
        <div className="flex items-center gap-2 text-[#969AA0]">
          <span>{data.user.username}</span><Dot/>
          <span className="text-xs">{formatDate(  data.createdAt)}</span>
        </div>
        <p className="font-semibold text-[#FCFCFD]">{data.comment}</p>
      </div>
    </div>
  );
};

export default Comment;
// `/static/images/cards/comic0.png`;
