"use client";

import { Skeleton } from "@nextui-org/react";

export const LoadingLibraryItem = () => {
  return (
    <div className="flex flex-col gap-[18px] bg-[var(--bg-secondary)] rounded-[8px] p-6 lg:p-9">
      <div className=" flex gap-6">
        <div className="base:w-full sm:w-[30%] min-w-[120px] max-w-[241px] h-[140px] md:h-[271px] rounded-lg overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="w-[80%] ">
        <Skeleton className="w-1/6 h-[10px] mb-5" />
          <Skeleton className="w-1/5 h-[20px]" />

          <div className="flex flex-col sm:flex-row text-gray text-xs md:text-base gap-1 sm:gap-6 justify-between w-full max-w-[460px] py-3">
            <Skeleton className="w-3/5 h-[12px]" />
            <Skeleton className="w-3/5 h-[12px]" />
            <Skeleton className="w-3/5 h-[12px]" />
          </div>

          <div className="hidden md:block ">
            <Skeleton className="w-full h-[14px] mb-7" />
            <Skeleton className="w-[120px] h-[48px] rounded-md" />
          </div>
        </div>
      </div>
      <div className="md:hidden ">
        <Skeleton className="w-full h-[10px] mb-7" />
        <Skeleton className="w-[120px] h-[48px] rounded-md" />
      </div>
    </div>
  );
};
const LoadingLibraryItems = () => {
  return (
    <div className="w-full flex flex-col gap-8 ">
      {[1, 2, 3]?.map((item, i) => (
        <div key={i}>
          <LoadingLibraryItem />
        </div>
      ))}
    </div>
  );
};

export default LoadingLibraryItems;
