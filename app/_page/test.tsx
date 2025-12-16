"use client";
import React, { useEffect, useState } from "react";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";
import { Comic } from "@/helpers/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// @ts-ignore
import "swiper/css";
import CardTitleOutside from "../_shared/cards/cardTitleOutside";

const HorizontalScroll = () => {
  const [actionItems, setActionItems] = useState<Comic[]>([]);
  const [ComedyItems, setComedyItems] = useState<Comic[]>([]);
  const [page, setPage] = useState<number>(1);
  const [comedyPage, setComedyPage] = useState<number>(1);

  const fetchMoreData = () => {
    setPage((prev) => prev + 1);
  };
  const fetchMoreComedyData = () => {
    setComedyPage((prev) => prev + 1);
  };
  const { data: genreList } = useQuery({
    queryKey: ["all_genres"],
    queryFn: () => getRequest("/genres/pull/list"),
  });

  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [`genre_action`, page],
    queryFn: () => getRequest(`/genres/comic/1/all?page=${page}&limit=${6}`),
  });
  const {
    data: comedyData,
    isLoading: comedyIsLoading,
    isFetching: comedyIsFetching,
    isSuccess: comedyIsSuccess,
  } = useQuery({
    queryKey: [`genre_comedy`, comedyPage],
    queryFn: () =>
      getRequest(`/genres/comic/3/all?page=${comedyPage}&limit=${5}`),
  });

  useEffect(() => {
    if (isSuccess) {
      setActionItems((prev) => [...prev, ...(data?.data?.comics || [])]);
    }
  }, [isFetching, isLoading, data]);
  useEffect(() => {
    if (comedyIsSuccess) {
      setComedyItems((prev) => [...prev, ...(comedyData?.data?.comics || [])]);
    }
  }, [comedyIsLoading, comedyIsFetching, comedyIsSuccess]);

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
          {actionItems.map((item, i) => {
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
