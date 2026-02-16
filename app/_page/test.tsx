"use client";
import React from "react";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// @ts-ignore
import "swiper/css";
import CardTitleOutside from "../_shared/cards/cardTitleOutside";

const HorizontalScroll = () => {
  // const { data: genreList } = useQuery({
  //   queryKey: ["all_genres"],
  //   queryFn: () => getRequest("/genres/pull/list"),
  // });

  const { data } = useQuery({
    queryKey: ["genre_action"],
    queryFn: () => getRequest("/genres/comic/1/all?page=1&limit=6"),
  });
  const actionItems = data?.data?.comics || [];

  // const { data: comedyData } = useQuery({
  //   queryKey: ["genre_comedy"],
  //   queryFn: () => getRequest("/genres/comic/3/all?page=1&limit=5"),
  // });
  // const comedyItems = comedyData?.data?.comics || [];

  // Calculate if we have enough slides for loop
  const slidesPerView = 3.1;
  const hasEnoughSlidesForLoop = actionItems.length > slidesPerView * 2;

  return (
    <div className="block md:hidden lg:hidden xl:hidden">
      <div className="parent-wrap block pt-10">
        <div className="child-wrap">
          <H2SectionTitle title="Favourites Genre" />
        </div>
      </div>
      {actionItems.length > 0 && (
        <Swiper
          key={actionItems.length}
          modules={[Autoplay]}
          loop={hasEnoughSlidesForLoop}
          autoplay={
            hasEnoughSlidesForLoop
              ? {
                  delay: 3000,
                  disableOnInteraction: false,
                }
              : false
          }
          spaceBetween={9}
          slidesPerGroup={1}
          slidesPerView={slidesPerView}
          initialSlide={0}
          centeredSlides={hasEnoughSlidesForLoop}
        >
          {actionItems.map((item: any, i: number) => {
            return (
              <SwiperSlide key={`${item.uuid || item.id || i}-${i}`}>
                <CardTitleOutside cardData={item} index={i} noTitle />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default HorizontalScroll;
