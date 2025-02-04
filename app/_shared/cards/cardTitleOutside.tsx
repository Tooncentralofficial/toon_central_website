"use client";
import Image from "next/image";
import Link from "next/link";
import Likes from "./likes";

const CardTitleOutside = ({
  cardData,
  index,
  queryKey,
}: {
  cardData: any;
  index: number;
  queryKey?:string
}) => {
  return (
    <div>
      <div className="h-[110px] md:h-[320px]  rounded-[8px] overflow-hidden">
        <div className="h-full w-auto relative">
          <Image
            src={`${cardData?.coverImage || ""}`}
            alt={`${cardData?.title || "toon_central"}`}
            width={200}
            height={240}
            style={{
              objectFit: "cover",
              maxWidth: "100%",
              width: "100%",
              height: "100%",
            }}
            unoptimized
          />
          <Link href={`${cardData?.uuid ? `/comics/${cardData?.uuid}` : ""}`}>
            <div className="absolute top-0 left-0 p-1  h-full w-full flex flex-col justify-end sm:p-4 bg-[#FCFCFD10] ">
              <Likes
                likesNViews={cardData?.likesAndViews}
                queryKey={queryKey}
                uid={cardData?.uuid}
                favourites={cardData?.favourites}
              />
            </div>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 items-center justify-between mt-1.5">
        <span className="font-bold text-base">{cardData?.title}</span>
        <span className="font-light text-xs">{cardData?.genre?.name}</span>
      </div>
    </div>
  );
};

export default CardTitleOutside;
