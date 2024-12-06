"use client";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { VerticalMenu } from "@/app/_shared/icons/icons";
import React, { useState } from "react";

const ChapterLink = ({
  uid,
  index,
  image,
  chapter,
}: {
  uid:any
  index: number;
  image: string;
  chapter: any;
}) => {
  const [show,setShow]= useState<boolean>(false)
  const router = useRouter();
  const readChapter = () =>
    router.push(`/comics/${uid}/chapter?chapter=${index}&uid=${uid}`);
  return (
    <div className="flex gap-4 relative">
      <div className="w-[60px] h-[60px] rounded-lg overflow-hidden">
        <Image
          src={image}
          width={60}
          height={60}
          alt={`${chapter?.title || "toon_central"}`}
          style={{
            objectFit: "cover",
            maxWidth: "100%",
            width: "100%",
            height: "100%",
          }}
          unoptimized
        />
      </div>
      <div className="cursor-pointer " onClick={readChapter}>
        <p className="mb-3 text-[#969AA0]">{chapter?.slug}</p>
        <p className="font-bold text-[#FCFCFD]">{chapter?.title}</p>
      </div>
      <div className="mt-1 ml-2" onClick={() => setShow((prev) => !prev)}>
        <VerticalMenu />
      </div>
      {show && (
        <div className="absolute w-[10rem] h-[7rem] bg-[#151d29b9] flex flex-col gap-1 rounded-md left-3">
          <p className="hover:bg-[#05834B] pl-3">Edit</p>
          <p className="hover:bg-[#05834B] pl-3">View mobile</p>
          <p className="hover:bg-[#05834B] pl-3">Delete</p>
        </div>
      )}
    </div>
  );
};

export default ChapterLink;
