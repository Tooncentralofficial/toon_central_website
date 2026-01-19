"use client";
import { Skeleton } from "@nextui-org/react";

export default function SubPlanSkeleton() {
  return (
    <div className="border w-full px-4 pt-4 pb-8 rounded-[10px] border-transparent">
      <div className="border-[3px] border-separate rounded-[10px] p-5 border-transparent">
        {/* Plan name skeleton */}
        <Skeleton className="w-3/5 h-6 mb-4 rounded-lg" />

        {/* Price section skeleton */}
        <div className="flex items-end gap-1">
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="w-20 h-16 rounded-lg" />
          <div className="ml-1 flex flex-col gap-1">
            <Skeleton className="w-8 h-3 rounded" />
            <Skeleton className="w-10 h-3 rounded" />
          </div>
        </div>
      </div>

      {/* Description skeleton */}
      <Skeleton className="w-4/5 h-3 mt-2 mx-auto rounded" />

      {/* Button skeleton */}
      <Skeleton className="w-full h-[40px] mt-6 rounded-xl" />

      {/* Features list skeleton */}
      <div className="pl-2 flex flex-col gap-7 mt-8">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full flex-shrink-0" />
            <Skeleton className="w-3/4 h-4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
