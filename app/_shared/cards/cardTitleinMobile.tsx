"use client";
import React from "react";
import Likes from "./likes";
import { ComicLink } from "./ComicLink";
const CardTitleInMobile = ({
  cardData,
  index,
  cardWidth,
  expand,
  queryKey,
}: {
  cardData?: any;
  index?: number;
  cardWidth?: string;
  expand?: boolean;
  queryKey?: string;
}) => {
  return (
    <div className="rounded-xl">
      <ComicLink
        uuid={cardData?.uuid}
        className="block w-[7.1rem] h-[6.5rem] flex flex-col justify-end pl-1 pb-1"
        style={{
          backgroundImage: `url(${cardData?.backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div>
          <p>{cardData?.title}</p>
          <Likes
            likesNViews={cardData?.likesAndViews}
            queryKey={queryKey}
            uid={cardData?.uuid}
            favourites={cardData?.favourites}
            small
          />
        </div>
      </ComicLink>
    </div>
  );
};

export default CardTitleInMobile;
