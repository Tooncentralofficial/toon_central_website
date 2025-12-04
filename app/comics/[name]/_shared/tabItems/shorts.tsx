"use client";
import React, { useState } from "react";
import shortImage from "@/public/static/images/auth_bkg.png";
import Image from "next/image";
import { PlayIcon } from "@/app/_shared/icons/icons";
import { array } from "yup";
import { Skeleton } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/app/utils/queries/requests";
import PaginationCustom from "@/app/_shared/sort/pagination";

function ShortsTab({ uid, data }: { uid: string; data: any }) {
  const [page, setPage] = useState(1);
  const limit = 12;

  // Fetch shorts with pagination
  const { data: shortsData, isLoading } = useQuery({
    queryKey: ["shorts", page],
    queryFn: () => getRequest(`/home/shorts?page=${page}&limit=${limit}`),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const shorts = shortsData?.data || [];
  const totalPages = shortsData?.totalPages || 1;
  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <SkeletonShortItem key={index} />
          ))}
        </div>
      ) : shorts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
          {shorts.map((short: any, index: number) => (
            <ShortItem key={short.id || index} short={short} />
          ))}
        </div>
      ) : (
        <NoShortsEmpty />
      )}

      {/* Pagination */}
      <div className="mt-8 flex w-full bg-[#00000]">
        <PaginationCustom
          page={page}
          total={totalPages}
          onChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
}

const ShortItem = ({ short }: { short: any }) => {
  if (!short) {
    return (
      <div className="h-[18.5rem] w-full relative bg-gray-700 rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="h-[18.5rem] w-full relative rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
      <Image
        src={short.thumbnail || short.image || shortImage}
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
