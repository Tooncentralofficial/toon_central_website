"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import EllipseGray from "../_shared/ellipse/ellipseGray";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import {
  ColouredThumbsupSolid,
  Dot,
  EyeFilled,
  HeartTwoTone,
  ThumbsSolid,
} from "../_shared/icons/icons";
import { getRequest, getRequestProtected } from "../utils/queries/requests";
import { useMutation, useQuery } from "@tanstack/react-query";
import { dummyItems } from "../_shared/data";
import { Skeleton } from "@nextui-org/react";
import "../popular.css";
import { parseArray } from "@/helpers/parsArray";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { log } from "util";
import Likes from "../_shared/cards/likes";
const Popular = () => {
  let sliderRef: any = useRef(null);

  const [carouselItems, setCarouselItems] = useState<any[]>([]);
  const { user, token } = useSelector(selectAuthState);
  const queryKey = "popular_by_toon";
  const pathname = usePathname();
  const infinite = useMemo(() => carouselItems.length > 1, [carouselItems]);
  const settings = {
    dots: true,
    infinite: infinite,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
    autoplay: true,
    arrows: false,
  };
  const { data, isFetching, isLoading, isError, isSuccess } = useQuery({
    queryKey: [queryKey],
    queryFn: () =>
      getRequest("/home/popular-by-toon-central?filter=all&page=1&limit=10"),
  });
  useEffect(() => {
    setCarouselItems(dummyItems);
    if (isSuccess) {
      setCarouselItems(data?.data?.comics || dummyItems);
    }
  }, [isLoading, isFetching, data]);
  const router = useRouter();
  console.log(data);

  const goToComic = (uuid: string | undefined) => {
    router.push(uuid ? `/comics/${uuid}` : "");
  };
  const { mutate: likeComic, isPending } = useMutation({
    mutationKey: ["like"],
    mutationFn: (uid) =>
      getRequestProtected(`/comics/${uid}/like`, token, pathname),
    onSuccess: (data) => {
      if (data?.success) {
        toast(data?.message, {
          toastId: `toast`,
          type: "success",
        });
        // queryClient.invalidateQueries({
        //   queryKey: [queryKey],
        // });
        return;
      }
      toast(data?.message, {
        toastId: `toast`,
        type: "error",
      });
    },
    onError(error, variables, context) {
      toast("Failed to like", {
        toastId: `toast`,
        type: "error",
      });
    },
  });
  return (
    <div className="parent-wrap pt-10 relative">
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
            {carouselItems.map((item, i) => {
              return (
                <>
                  <div key={i} className="px-2.5">
                    <div className="h-[290px] rounded-[8px] overflow-hidden">
                      {isLoading ? (
                        <>
                          <Skeleton className="h-full bg-[var(--bg-secondary)]" />
                        </>
                      ) : (
                        <div className="h-full overflow-hidden w-auto relative">
                          <Image
                            src={`${item?.backgroundImage || ""}`}
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
                              <div
                                className="font-bold text-[48px] uppercase cursor-pointer "
                                onClick={() => goToComic(item?.uuid)}
                              >
                                {item?.title}
                              </div>
                              <div className="flex items-center gap-[9px] my-4">
                                <Likes
                                  likesNViews={item?.likesAndViews}
                                  uid={item?.uuid}
                                  queryKey={queryKey}
                                />
                                {/* <div className="flex items-center gap-[2.5px] text-sm font-light">
                                  <EyeFilled />{" "}
                                  {
                                    parseArray(item?.likesAndViews?.views)
                                      .length
                                  }
                                </div> */}
                                {/* <Dot /> */}
                                {/* <div className="flex items-center gap-[2.5px] text-sm font-light">
                              <HeartTwoTone /> 1k
                            </div> */}
                                {/* <Dot />
                                <div
                                  className="flex items-center gap-[2.5px] text-sm font-light"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    likeComic(item?.uuid);
                                  }}
                                >
                                  {isLiked ? (
                                    <ColouredThumbsupSolid />
                                  ) : (
                                    <ThumbsSolid />
                                  )}{" "}
                                  {
                                    parseArray(item?.likesAndViews?.likes)
                                      .length
                                  }
                                </div> */}
                              </div>
                              <div>{item?.genre?.name}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Popular;
