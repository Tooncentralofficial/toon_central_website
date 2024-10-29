"use client";
import Image from "next/image";
import Likes from "./likes";
import Link from "next/link";
import {motion} from "framer-motion"
const CardTitleBottom = ({
  cardData,
  index,
  cardWidth,
  expand,
}: {
  cardData: any;
  index: number;
  cardWidth?:string;
  expand?:boolean;
}) => {
  return (
    <div
      className={`h-[260px] rounded-[10px] overflow-hidden`}
      style={{ width: cardWidth || "100%" }} // Inline style for dynamic width
      //className="h-[260px] min-w-max w-max  rounded-[8px] overflow-hidden"
    >
      <div className="h-full overflow-hidden w-auto relative">
        <Image
          src={`${cardData?.coverImage || ""}`}
          alt={`${cardData?.title || "toon_central"}`}
          width={200}
          height={260}
          style={{
            objectFit: "cover",
            width: "100%",
            maxWidth: "100%",
            height: "100%",
          }}
          unoptimized
          priority
        />
        <Link
          href={`${
            cardData?.uuid
              ? `/comics/${cardData?.uuid}`
              : ""
          }`}
        >
          <div className="absolute top-0 left-0  h-full w-full flex flex-col  p-4 justify-end bg-[#0D111D70] ">
            <div>
              <div className="font-bold text-xl">{cardData?.title}</div>
              <div className="flex justify-between">
                <Likes likesNViews={cardData?.likesAndViews} />
                {expand && (
                  <motion.a
                    href=""
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="bg-[--green100] px-4 py-1 rounded-[4px]"
                  >
                    Favourite
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CardTitleBottom;
