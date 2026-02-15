"use client";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/app/utils/imageUtils";
import Link from "next/link";
import Likes from "./likes";
import { DarkEyeIcon } from "../icons/icons";
import { ComicGenre } from "@/app/trending/_components/trendingItem";

const CardTitleOutside = ({
  cardData,
  index,
  queryKey,
  noTitle,
}: {
  cardData: any;
  index: number;
  queryKey?: string;
  noTitle?: boolean;
}) => {
  const views = cardData?.likesAndViews?.views?.length;
  return (
    <div>
      <div className="h-[135px] sm:h-[250px] md:h-[320px]  rounded-[4px] overflow-hidden">
        <div className="h-full w-auto relative">
          <div className="absolute top-0 left-0 ">
            <div className="font-bold text-xl  bg-[#3EFFA2] flex  items-center gap-[0.2rem] m-1 rounded-full px-1 h-3 overflow-hidden ">
              <p className="text-[6.7px] md:text-[12px] text-[#061A29] ">
                {views}
              </p>

              <DarkEyeIcon width={10} height={10} />
            </div>
          </div>
          <Link href={`${cardData?.uuid ? `/comics/${cardData?.uuid}` : ""}`}>
            <Image
              src={optimizeCloudinaryUrl(cardData?.coverImage ?? "")}
              alt={`${cardData?.title || "toon_central"}`}
              width={200}
              height={240}
              style={{
                objectFit: "cover",
                maxWidth: "100%",
                width: "100%",
                height: "100%",
              }}
            />

            <div className="hidden absolute top-0 left-0 p-1  h-full w-full md:hidden flex-col justify-end sm:p-4 bg-[#FCFCFD10] ">
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
      <div className="flex flex-col flex-wrap gap-2 justify-center mt-1.5">
        {!noTitle && (
          <span className="font-bold text-base">{cardData?.title}</span>
        )}

        <span className="flex flex-wrap">
          {cardData.genres.map((item: ComicGenre, i: number) => (
            <p
              key={i}
              className={`text-[#FCFCFD] font-extralight text-[0.75rem] ${
                i < cardData.genres.length - 1 && "mr-1"
              }`}
            >
              {item.genre.name}
              {i < cardData.genres.length - 1 && ","}
            </p>
          ))}
        </span>
      </div>
    </div>
  );
};

export default CardTitleOutside;
