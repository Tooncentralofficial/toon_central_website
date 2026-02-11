import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/app/utils/imageUtils";
import React from "react";
import image from "@/public/static/images/comics/new_0.png";
import { Comic } from "@/helpers/types";
import Link from "next/link";
import { GreeFlameIcon } from "../icons/icons";
const PopularToonscard = ({ item, index }: { item: Comic; index: number }) => {
  return (
    <Link href={`${item?.uuid ? `/comics/${item?.uuid}` : ""}`}>
      <div className="flex gap-5">
        <p
          className={`${
            index === 0 && "bg-[#05834B] rounded-[50%]"
          } h-[1.5rem] w-[1.5rem] flex items-center justify-center`}
        >
          {index + 1}
        </p>
        <div className="w-[45px] h-[45px] overflow-hidden rounded-[6px]">
          <Image
            src={optimizeCloudinaryUrl(item.coverImage)}
            width={40}
            height={40}
            alt={`item`}
            style={{
              objectFit: "cover",
              width: "100%",
              minHeight: "100%",
            }}
          />
        </div>
        <div>
          <p className="text-[0.9rem] font-[300]">
            {item?.genres?.[0]?.genre.name}{" "}
          </p>
          <p className="text-[1.1rem] font-[700]">{item?.title}</p>
        </div>
      </div>
    </Link>
  );
};

export const PopularToonscardDesktop = ({
  item,
  index,
}: {
  item: Comic;
  index: number;
}) => {
  return (
    <Link href={`${item?.uuid ? `/comics/${item?.uuid}` : ""}`}>
      <div className="flex gap-5 relative mt-5">
        {index === 0 && (
          <div className="absolute z-10">
            <GreeFlameIcon className={"w-[2rem] h-[2rem] text-[#05834B]"} />
          </div>
        )}
        <p
          className={` h-[2rem] w-[2rem] flex items-center justify-center z-20`}
        >
          {index + 1}
        </p>
        <div className="w-[6rem] h-[8rem] overflow-hidden rounded-[6px]">
          <Image
            src={optimizeCloudinaryUrl(item.coverImage)}
            width={96}
            height={128}
            alt={`item`}
            style={{
              objectFit: "cover",
              width: "100%",
              minHeight: "100%",
            }}
          />
        </div>
        <div>
          <p className="text-[1.2rem] font-[300]">
            {item?.genres?.[0]?.genre.name}{" "}
          </p>
          <p className="text-[1.8rem] font-[700]">{item?.title}</p>
        </div>
      </div>
    </Link>
  );
};

export default PopularToonscard;
