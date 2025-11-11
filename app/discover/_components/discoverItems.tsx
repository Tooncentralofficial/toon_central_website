import React from "react";
import Image from "next/image";
import { AddBox, RemoveBox } from "@/app/_shared/icons/icons"
const DiscoverItems = ({
  data,
  isSubscribed,
  onToggleSubscribe,
}: {
  data: any;
  isSubscribed: boolean;
  onToggleSubscribe: () => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-[var(--bg-secondary)] mt-6">
      <div className="flex items-center gap-4">
        <div className="w-[60px] h-[60px] overflow-hidden rounded-[6px]">
          <Image
            src={data?.coverImage || ""}
            width={60}
            height={60}
            alt={data?.title || ""}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold">{data.title}</span>
          <span className="text-sm text-gray-300">
            {data.genres?.map((g: any, i: number) => (
              <React.Fragment key={i}>
                {g.genre.name}
                {i < data.genres.length - 1 && ", "}
              </React.Fragment>
            ))}
          </span>
        </div>
      </div>

      <div
        onClick={onToggleSubscribe}
        className="cursor-pointer hover:bg-[#afb0af21] p-2 rounded-full"
      >
        {isSubscribed ? <RemoveBox /> : <AddBox />}
      </div>
    </div>
  );
};

export default DiscoverItems;
