"use client";

import React from "react";
import CardTitleOutside from "@/app/_shared/cards/cardTitleOutside";
import { Skeleton } from "@nextui-org/react";
import LoadingTitleOutside from "@/app/_shared/cards/loadingTitleOutside";

interface ComicsGridProps {
  comics: any[];
  isLoading: boolean;
}

const ComicsGrid = ({ comics, isLoading }: ComicsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <LoadingTitleOutside key={index} />
        ))}
      </div>
    );
  }

  if (!comics || comics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="max-w-[300px] w-full">
          <div className="flex justify-center mb-6">
            <svg
              className="w-12 h-12 text-[#475467] opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div className="text-[#475467] text-center">
            <h3 className="text-lg font-semibold mb-2">No Comics Available</h3>
            <p className="text-sm">
              This creator hasn&apos;t uploaded any comics yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {comics.map((comic: any, index: number) => (
        <CardTitleOutside
          key={comic.id || comic.uuid || index}
          cardData={{
            ...comic,
            coverImage: comic.cover_image,
            title: comic.title,
            uuid: comic.uuid,
            genres: comic.genres || [],
            likesAndViews: comic.likesAndViews || { views: [], likes: [] },
            favourites: comic.favourites || [],
          }}
          index={index}
        />
      ))}
    </div>
  );
};

export default ComicsGrid;
