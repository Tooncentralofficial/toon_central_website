"use client";

import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import EllipseGray from "../_shared/ellipse/ellipseGray";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import { Dot, EyeFilled, HeartTwoTone, ThumbsSolid } from "../_shared/icons/icons";
import { getRequest } from "../utils/queries/requests";
import { useQuery } from "@tanstack/react-query";
import { dummyItems } from "../_shared/data";
import { Skeleton } from "@nextui-org/react";
import "../popular.css";
const Popular = () => {
  let sliderRef: any = useRef(null);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
    autoplay: true,
    arrows: false,
  };
  const [carouselItems, setCarouselItems] = useState<any[]>([]);
  const { data, isFetching, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["popular_by_toon"],
    queryFn: () =>
      getRequest("/home/popular-by-toon-central?filter=all&page=1&limit=10"),
  });
  useEffect(() => {
    setCarouselItems(dummyItems);
    if (isSuccess) {
      setCarouselItems(data?.data?.comics || dummyItems);
    }
  }, [isLoading, isFetching, data]);
  return (
    <div className="parent-wrap py-10 relative">
      <div className="child-wrap flex w-full flex-col">
        <H2SectionTitle title="Popular by ToonCentral" />
        <div className=" slider-container">
          <EllipseGray />
          <Slider
            ref={(slider) => {
              sliderRef = slider;
            }}
            {...settings}
          >
            {carouselItems.map((item, i) => (
              <div key={i} className="px-2.5">
                <div className="h-[290px] rounded-[8px] overflow-hidden">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-full bg-[var(--bg-secondary)]" />
                    </>
                  ) : (
                    <div className="h-full overflow-hidden w-auto relative">
                      <Image
                        src={`${
                          item?.coverImage ||
                          "/static/images/cards/comic_banner.png"
                        }`}
                        alt={`${item?.title || "toon_central"}`}
                        width={200}
                        height={290}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          maxWidth: "100%",
                          height: "100%",
                        }}
                        unoptimized
                      />
                      <div className="absolute top-0 left-0  h-full w-full flex flex-col  p-4 justify-center bg-[#0D111D70] ">
                        <div className="">
                          <div className="font-bold text-[48px] uppercase">
                            {item?.title}
                          </div>
                          <div className="flex items-center gap-[9px] my-4">
                            <div className="flex items-center gap-[2.5px] text-sm font-light">
                              <EyeFilled /> 100
                            </div>
                            <Dot />
                            <div className="flex items-center gap-[2.5px] text-sm font-light">
                              <HeartTwoTone /> 1k
                            </div>
                            <Dot />
                            <div className="flex items-center gap-[2.5px] text-sm font-light">
                              <ThumbsSolid /> 100
                            </div>
                          </div>
                          <div>{item?.genre?.name}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Popular;
