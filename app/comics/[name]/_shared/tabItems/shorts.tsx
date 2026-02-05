"use client";
import React from "react";
import shortImage from "@/public/static/images/auth_bkg.png";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/app/utils/imageUtils";
import Link from "next/link";
import { PlayIcon } from "@/app/_shared/icons/icons";

function ShortsTab({ uid, data }: { uid: string; data: any }) {
  const shorts = data?.shorts || [];

  return (
    <div>
      {shorts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
          {shorts.map((short: any, index: number) => (
            <ShortItem key={short.id || index} short={short} />
          ))}
        </div>
      ) : (
        <NoShortsEmpty />
      )}
    </div>
  );
}

const ShortItem = ({ short }: { short: any }) => {
  if (!short) {
    return (
      <div className="h-[18.5rem] w-full relative bg-gray-700 rounded-lg animate-pulse" />
    );
  }

  const shortUrl = short.uuid
    ? `/shorts/${short.uuid}`
    : short.id
    ? `/shorts/${short.id}`
    : "/shorts";

  return (
    <Link href={shortUrl}>
      <div className="h-[18.5rem] w-full relative rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
        <Image
          src={optimizeCloudinaryUrl(short.cover_image) || shortImage}
          alt={short.title || "short"}
          width={300}
          height={400}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />
        <div className="inset-0 bg-[#000] opacity-20 absolute" />
        <div className="absolute bottom-2 left-2 flex gap-2 text-white">
          <p>
            <PlayIcon className="w-6 h-6" />
          </p>
          <p>{short.views || short.likesAndViews?.views?.length || 0}</p>
        </div>
      </div>
    </Link>
  );
};

const NoShortsEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="max-w-[300px] w-full">
        <div className="flex justify-center mb-6">
          <PlayIcon className="w-12 h-12 text-[#475467] opacity-50" />
        </div>
        <div className="text-[#475467] text-center">
          <h3 className="text-lg font-semibold mb-2">No Shorts Available</h3>
          <p className="text-sm">
            This creator hasn&apos;t uploaded any shorts yet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShortsTab;
