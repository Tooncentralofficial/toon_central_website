"use client";
import { Skeleton } from "@nextui-org/react";

export default function CreditPlanSkeleton() {
  return (
    <div className="border w-full px-4 pt-4 pb-8 rounded-[10px] border-transparent">
      <div className="border-[3px] border-separate rounded-[10px] p-5 border-transparent">
        {/* Price section skeleton - centered */}
        <div className="flex items-center justify-center gap-1">
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="w-20 h-16 rounded-lg" />
        </div>
      </div>

      {/* Empty space for description */}
      <div className="w-full h-3 mt-2" />

      {/* Credits info box skeleton */}
      <div className="bg-[#1E293B] rounded-lg p-4 mt-5">
        <div className="flex items-center gap-3">
          <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-16 h-3 rounded" />
            <Skeleton className="w-24 h-5 rounded" />
          </div>
        </div>
      </div>

      {/* Button skeleton */}
      <Skeleton className="w-full h-[40px] mt-6 rounded-xl" />
    </div>
  );
}
