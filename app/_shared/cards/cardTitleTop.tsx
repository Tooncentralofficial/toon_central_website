"use client";
import Image from "next/image";
import Link from "next/link";
import Likes from "./likes";

const link = `/comics/0`;
const CardTitleTop = ({
  cardData,
  index,
  queryKey,
}: {
  cardData: any;
  index: number;
  queryKey?:string
}) => {
  return (
    <div className="h-[150px] md:h-[260px]  rounded-[8px] overflow-hidden">
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
          //unoptimized
        />
        <Link href={`${cardData?.uuid ? `/comics/${cardData?.uuid}` : ""}`}>
          <div className="absolute top-0 left-0  h-full w-full flex flex-col justify-between  p-4 bg-[#FCFCFD10] ">
            <div>
              <div className="font-bold text-md">{cardData?.title}</div>
              <Likes
                likesNViews={cardData?.likesAndViews}
                queryKey={queryKey}
                uid={cardData?.uuid}
              />
            </div>
            <div>{cardData?.genre?.name}</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CardTitleTop;
