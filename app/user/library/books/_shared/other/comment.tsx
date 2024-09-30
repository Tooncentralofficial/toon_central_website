"use client";
import { Dot } from "@/app/_shared/icons/icons";
import Image from "next/image";
import React from "react";

const Comment = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-[30px] h-[30px] rounded-lg overflow-hidden">
        <Image
          src={`/static/images/cards/comic0.png`}
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
          <span>ToonsCentral</span><Dot/>
          <span className="text-xs">1 day ago</span>
        </div>
        <p className="font-semibold text-[#FCFCFD]">Very nice touch to the comics Very n</p>
      </div>
    </div>
  );
};

export default Comment;
