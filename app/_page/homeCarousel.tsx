"use client";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { ArrowLeft, ArrowRight } from "../_shared/icons/icons";
import CardTitleBottom from "../_shared/cards/cardTitleBottom";
import { getRequest } from "../utils/queries/requests";
import { useQuery } from "@tanstack/react-query";
import { dummyItems } from "../_shared/data";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { motion } from "framer-motion";
import Curve from "../_shared/curve";
import EllipseGray, { Ellipse } from "../_shared/ellipse/ellipseGray";
export const staticCardItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
function HomeCarousel() {
  const [carouselItems, setCarouselItems] = useState<any>([]);
  const [screenSize, setScreenSize] = useState<string>("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [isHovering, setIsHovering] = useState(false);
  const [slidesPerPage, setSlidesPerPage] = useState(5);
  const swiperRef: any = useRef(null);
  const [currentGroup, setCurrentGroup] = useState(0);
  const carouselQueryKey = "carousel";
  const { data, isFetching, isLoading, isError, isSuccess } = useQuery({
    queryKey: [carouselQueryKey],
    queryFn: () => getRequest("/home/top-carousel?page=1&limit=10"),
  });
  const swiper = useSwiper();
  useEffect(() => {
    if (isSuccess) {
      setCarouselItems(data?.data?.comics || dummyItems);
    }
  }, [isLoading, isFetching, data]);
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.params) {
      const { slidesPerView } = swiperRef.current.params;
      setSlidesPerPage(slidesPerView);
    }
  }, [swiperRef.current, currentSlide]);
  let sliderRef: any = useRef();
  const handleSlideChange = (swiper: any) => {
    // Calculate the current group index
    const groupIndex = Math.floor(
      swiper.realIndex / swiper.params.slidesPerGroup
    );
    setCurrentGroup(groupIndex);
  };
  useEffect(() => {
    if (swiperRef.current) {
      if (isHovering) {
        swiperRef.current.autoplay.stop();
      } else {
        swiperRef.current.autoplay.start();
      }
    }
  }, [isHovering]);
  useEffect(() => {
    const updateSliced = () => {
      if (window.matchMedia("(max-width: 550px)").matches) {
        setScreenSize("small");
      } else {
        setScreenSize("");
      }
    };

    updateSliced();

    const resizeListener = () => updateSliced();
    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);
  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };
  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const ArrowCircle = ({ type }: { type: "left" | "right" }) => {
    return (
      <div
        onClick={type === "left" ? handlePrev : handleNext}
        className={`absolute top-[50%] translate-y-[-50%] ${
          type === "left" ? "left-[-40px]" : "right-[-40px]"
        } rounded-[50%] h-10 w-10 bg-[var(--green100)] hidden md:inline-grid place-items-center cursor-pointer`}
      >
        {type === "left" ? <ArrowLeft /> : <ArrowRight />}
      </div>
    );
  };
  // const ArrowCircle = ({ type }: { type: "left" | "right" }) => {
  //   return (
  //     <div
  //       onClick={type == "left" ? previous : next}
  //       className={`absolute top-[50%] translate-y-[-50%] ${
  //         type == "left" ? "left-[-40px]" : "right-[-40px]"
  //       } rounded-[50%] h-10 w-10 bg-[var(--green100)] hidden md:inline-grid place-items-center cursor-pointer`}
  //     >
  //       {type == "left" ? <ArrowLeft /> : <ArrowRight />}
  //     </div>
  //   );
  // };
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    arrows: false,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          // infinite:true
        },
      },
      // {
      //   breakpoint: 0,
      //   settings: {
      //     slidesToShow: 1,
      //     slidesToScroll: 1,
      //   },
      // },
    ],
  };
  const color = [
    "#21D19F",
    "#AB2346",
    "#820263",
    "#BFAB25",
    "#21D19F",
    "#AB2346",
    "#F08080",
    "#C5E7E2",
    "#453F78",
    "#664147",
  ];
  return (
    <>
      {screenSize === "small" ? (
        <div className="parent-wrap bg-[--homeCouroselbg]  transition-colors duration-400 ease-in-out relative">
          <Swiper
            modules={[Autoplay]}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            spaceBetween={15}
            slidesPerGroup={1}
            slidesPerGroupAuto={true}
          >
            {carouselItems.map((item: any, i: number) => (
              <SwiperSlide key={i}>
                <motion.div key={i} className="px-1">
                  <CardTitleBottom
                    cardData={item}
                    index={i}
                    queryKey={carouselQueryKey}
                    expand={
                      true
                    }
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="parent-wrap bg-[--homeCouroselbg] py-6  transition-colors duration-400 ease-in-out relative">
          <div
            className="absolute inset-0 "
            style={{
              backgroundImage:
                hoverIndex !== -1 && carouselItems[hoverIndex]?.backgroundImage
                  ? `url(${carouselItems[hoverIndex]?.backgroundImage})`
                  : `url(${carouselItems[currentSlide]?.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(2px)",
            }}
          />
          {/* <Ellipse /> */}
          <div className="child-wrap-sm home-slick-cont relative">
            <div className="relative">
            {/* <Curve
                backgroundImage={
                  hoverIndex !== -1 &&
                  carouselItems[hoverIndex]?.backgroundImage
                    ? `url(${carouselItems[hoverIndex].backgroundImage})`
                    : `url(${carouselItems[currentSlide]?.backgroundImage})`
                }
                activeImage={
                  hoverIndex !== -1 &&
                  carouselItems[hoverIndex]?.backgroundImage
                    ? carouselItems[hoverIndex].backgroundImage
                    : carouselItems[currentSlide]?.backgroundImage
                }
              /> */}

              <Swiper
                modules={[Autoplay]}
                slidesPerView={5}
                spaceBetween={5}
                pagination={{
                  clickable: true,
                }}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                navigation={true}
                slidesPerGroup={5}
                slidesPerGroupAuto={true}
                className="mySwiper"
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
                  setCurrentSlide(swiper.realIndex);
                  handleSlideChange(swiper);
                }}
                breakpoints={{
                  1150: {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                  },
                  1024: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                  },
                  700: {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                  },
                  500: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                  },
                  200: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                  },
                }}
              >
                {carouselItems.map((item: any, i: number) => (
                  <SwiperSlide key={i}>
                    <motion.div
                      key={i}
                      animate={{
                        x:
                          hoverIndex !== -1
                            ? i < hoverIndex
                              ? "-2rem"
                              : i > hoverIndex
                              ? "2rem"
                              : "0rem"
                            : i < currentSlide && hoverIndex === -1
                            ? "-2rem"
                            : i > currentSlide && hoverIndex === -1
                            ? "5rem"
                            : i === 9
                            ? "-4rem"
                            : "0rem",
                        width:
                          hoverIndex === i ||
                          (i === currentSlide && hoverIndex === -1)
                            ? "21rem"
                            : "15.5rem",
                        translateX: hoverIndex === i ? "-3.0rem" : "0rem",
                        zIndex: hoverIndex == i ? 88 : currentSlide ? 2 : 0,
                        opacity: i === 0 && currentGroup === 1 ? 0 : 1,
                      }}
                      transition={{
                        duration: 0.5,
                      }}
                      onMouseOver={() => {
                        setIsHovering(true);
                        document.documentElement.style.setProperty(
                          "--homeCouroselbg",
                          color[i]
                        );
                        if (i == currentSlide) {
                          setHoverIndex(-1);
                        } else {
                          setHoverIndex(i);
                        }
                      }}
                      onMouseOut={() => {
                        setIsHovering(false);
                        setHoverIndex(-1);
                      }}
                    >
                      <CardTitleBottom
                        cardData={item}
                        index={i}
                        queryKey={carouselQueryKey}
                        expand={
                          hoverIndex === i ||
                          (hoverIndex === -1 && i === currentSlide)
                        }
                      />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <ArrowCircle type="left" />
              <ArrowCircle type="right" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HomeCarousel;
