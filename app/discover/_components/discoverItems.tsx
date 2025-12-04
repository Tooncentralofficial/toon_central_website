import React from "react";
import Image from "next/image";
import { AddBox, RemoveBox } from "@/app/_shared/icons/icons";
import Likes from "@/app/_shared/cards/likes";
const DiscoverItems = ({
  data,
  isSubscribed,
  onToggleSubscribe,
  queryKey,
}: {
  data: any;
  isSubscribed: boolean;
  onToggleSubscribe: () => void;
  queryKey: string;
}) => {
  console.log(data);
  return (
    <div className="flex items-end justify-between gap-4 px-2 py-4 md:px-8 rounded-lg bg-primary mt-3">
      <div className="flex gap-5 ">
        <div className="w-[40px] h-[60px] overflow-hidden rounded-[6px]">
          <Image
            src={data?.coverImage || ""}
            width={60}
            height={60}
            alt={data?.title || ""}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-bold text-lg">{data.title}</span>
          <Likes
            likesNViews={data?.likesAndViews}
            queryKey={queryKey}
            uid={data?.uuid}
            favourites={data?.favourites}
          />

          <span className="text-xs text-gray-300">{data?.user?.username}</span>
        </div>
      </div>

      <div
        // onClick={onToggleSubscribe}
        className="cursor-pointer hover:bg-[#afb0af21] flex pb-5 text-xs md:text-sm"
      >
        {data.genres?.map((g: any, i: number) => (
          <React.Fragment key={i}>
            {g.genre.name}
            {i < data.genres.length - 1 && ", "}
          </React.Fragment>
        ))}
        {/* {isSubscribed ? <RemoveBox /> : <AddBox />} */}
      </div>
    </div>
  );
};

export default DiscoverItems;
