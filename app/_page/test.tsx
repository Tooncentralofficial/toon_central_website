"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import image from "@/public/static/images/comics/new_0.png";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";
import { Comic } from "@/helpers/types";
import Link from "next/link";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import CardTitleOutside from "../_shared/cards/cardTitleOutside";

const HorizontalScroll = () => {
  let sliderRef: any = useRef(null);
  const [actionItems, setActionItems] = useState<Comic[]>([]);
  const [ComedyItems, setComedyItems] = useState<Comic[]>([]);
  const [page, setPage] = useState<number>(1);
  const [comedyPage, setComedyPage] = useState<number>(1);
  const infinite = useMemo(() => actionItems.length > 1, [actionItems]);
  const settings = {
    dots: false,
    infinite: infinite,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
    autoplay: true,
    arrows: false,
  };
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
  return (
    <div className="block md:hidden">
      <div className="parent-wrap block pt-10">
        <div className="child-wrap">
          <H2SectionTitle title="Favourites Genre" />
        </div>
      </div>
      <Swiper
        modules={[Autoplay]}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        spaceBetween={9}
        slidesPerGroup={1}
        slidesPerView={3.1}
        slidesPerGroupAuto={true}
        centeredSlides={true}
      >
        {actionItems.map((item, i) => {
          return (
            <SwiperSlide key={i}>
              <CardTitleOutside cardData={item} index={i} noTitle />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default HorizontalScroll;
