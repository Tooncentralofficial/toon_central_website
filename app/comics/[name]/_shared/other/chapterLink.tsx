"use client";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/app/utils/imageUtils";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback } from "react";

const ChapterLink = ({
  uid,
  index,
  image,
  comicId,
  chapter,
}: {
  uid: any;
  index: number;
  image: string;
  comicId: string;
  chapter: any;
}) => {
  const adLink = "https://otieu.com/4/9441919";
  const pathname = usePathname();
  const router = useRouter();
  const readChapter = () => {
    // if (index > 3-1) {
    //   window.open(adLink, "_blank");
    // }
    router.push(
      `${pathname}/chapter?chapter=${index}&uid=${uid}&comicid=${comicId}`
    );
  };
  return (
    <div className="flex gap-4">
      <div className="w-[60px] h-[60px] rounded-lg overflow-hidden">
        <Image
          src={optimizeCloudinaryUrl(image)}
          width={60}
          height={60}
          alt={`${chapter?.title || "toon_central"}`}
          style={{
            objectFit: "cover",
            maxWidth: "100%",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <div className="cursor-pointer " onClick={readChapter}>
        <p className="mb-3 text-[#969AA0]">{chapter?.slug}</p>
        <p className="font-bold text-[#FCFCFD]">{chapter?.title} </p>
      </div>
    </div>
  );
};

export default ChapterLink;
