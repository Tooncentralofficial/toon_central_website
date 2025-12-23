"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayIcon } from "@/app/_shared/icons/icons";
import { Skeleton } from "@nextui-org/react";
import shortImage from "@/public/static/images/auth_bkg.png";

interface ShortsGridProps {
  shorts: any[];
  isLoading: boolean;
}

const ShortsGrid = ({ shorts, isLoading }: ShortsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <SkeletonShortItem key={index} />
        ))}
      </div>
    );
  }

  if (!shorts || shorts.length === 0) {
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
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {shorts.map((short: any, index: number) => (
        <ShortItem key={short.id || index} short={short} />
      ))}
    </div>
  );
};

const ShortItem = ({ short }: { short: any }) => {
  if (!short) {
    return (
      <div className="h-[18.5rem] w-full relative bg-gray-700 rounded-lg animate-pulse" />
    );
  }

  const thumbnail = short.cover_image || short.upload || shortImage;
  const shortUrl = short.uuid ? `/shorts?short=${short.uuid}` : "/shorts";

  return (
    <Link href={shortUrl}>
      <div className="h-[18.5rem] w-full relative rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity group">
        <Image
          src={thumbnail}
          alt={short.title || "short"}
          width={300}
          height={400}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
          }}
          unoptimized
        />
        <div className="inset-0 bg-[#000] opacity-20 absolute" />
        <div className="absolute bottom-2 left-2 flex gap-2 text-white">
          <PlayIcon className="w-6 h-6" />
          <p className="text-sm">100</p>
        </div>
        {short.title && (
          <div className="absolute top-2 left-2 right-2">
            <p className="text-white text-sm font-semibold line-clamp-2 bg-black/50 px-2 py-1 rounded">
              {short.title}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

const SkeletonShortItem = () => {
  return (
    <div className="h-[18.5rem] w-full relative rounded-xl overflow-hidden">
      <Skeleton className="w-full h-full rounded-xl" />
      <div className="absolute bottom-2 left-2 flex gap-2">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="w-10 h-4 rounded-md" />
      </div>
    </div>
  );
};

export default ShortsGrid;
