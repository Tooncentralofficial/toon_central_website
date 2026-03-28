"use client";

import { Fragment, useMemo, useRef } from "react";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "../utils/imageUtils";
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
import { Comic } from "@/helpers/types";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import Likes from "../_shared/cards/likes";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ItelBanner from "@/public/static/images/events/itel/tooncent_itel_banner.jpeg";

/** Replace with the live itel / campaign URL when ready */
const ITEL_SPONSORED_BANNER_HREF = "https://example.com";

type PopularSlide =
  | { kind: "sponsored" }
  | { kind: "comic"; comic: Comic };

const Popular = () => {
  let sliderRef = useRef<Slider | null>(null);

  const { user, token } = useSelector(selectAuthState);
  const queryKey = "popular_by_toon";
  const pathname = usePathname();
  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () =>
      getRequest("/home/popular-by-toon-central?filter=all&page=1&limit=10"),
  });
  const carouselItems = data?.data?.comics || dummyItems;
  const sliderSlides: PopularSlide[] = useMemo(
    () => [
      { kind: "sponsored" },
      ...carouselItems.map((comic: Comic) => ({
        kind: "comic" as const,
        comic,
      })),
    ],
    [carouselItems],
  );
  const sliderSettings = useMemo(
    () => ({
      dots: false,
      infinite: sliderSlides.length > 1,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      initialSlide:
        carouselItems.length > 1 ? 2 : carouselItems.length === 1 ? 1 : 0,
      autoplay: true,
      arrows: false,
    }),
    [sliderSlides.length, carouselItems.length],
  );
  const router = useRouter();

  const goToComic = (uuid: string | undefined) => {
    if (uuid) router.push(`/comics/${uuid}`);
  };
  const { mutate: likeComic, isPending } = useMutation({
    mutationKey: ["like"],
    mutationFn: (uid: string) =>
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

  const renderSlide = (slide: PopularSlide, i: number) => {
    if (slide.kind === "sponsored") {
      return (
        <Fragment key="popular-sponsored-itel">
          <div className="px-2.5">
            <div className="hidden md:block h-[290px] rounded-[8px] overflow-hidden relative ring-1 ring-white/10">
              <p className="absolute top-2 left-3 z-10 text-[10px] uppercase tracking-wider text-white/90 drop-shadow-md font-medium">
                Sponsored
              </p>
              <a
                href={ITEL_SPONSORED_BANNER_HREF}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block relative h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E31B23] rounded-[8px]"
              >
                <Image
                  src={ItelBanner}
                  alt="itel City 200 — Sponsored"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 0px, 100vw"
                />
              </a>
            </div>
            <div className="visible md:hidden h-[99px] rounded-[8px] overflow-hidden relative ring-1 ring-white/10">
              <p className="absolute top-1 left-2 z-10 text-[9px] uppercase tracking-wider text-white/90 drop-shadow-md font-medium">
                Sponsored
              </p>
              <a
                href={ITEL_SPONSORED_BANNER_HREF}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block relative h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E31B23] rounded-[8px]"
              >
                <Image
                  src={ItelBanner}
                  alt="itel City 200 — Sponsored"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 0px"
                />
              </a>
            </div>
          </div>
        </Fragment>
      );
    }

    const item = slide.comic;
    return (
      <Fragment key={item?.uuid ?? `comic-${i}`}>
        <div className="px-2.5">
          <div className="hidden md:block h-[290px] rounded-[8px] overflow-hidden ">
            {isLoading ? (
              <>
                <Skeleton className="h-full bg-[var(--bg-secondary)]" />
              </>
            ) : (
              <div className="h-full overflow-hidden w-auto relative">
                <Image
                  src={optimizeCloudinaryUrl(item?.backgroundImage ?? "")}
                  alt={`${item?.title || "toon_central"}`}
                  width={600}
                  height={690}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    maxWidth: "100%",
                    height: "100%",
                  }}
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
                    </div>
                    <div>{item?.genre?.name}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="visible md:hidden h-[99px] rounded-[8px] overflow-hidden ">
            {isLoading ? (
              <>
                <Skeleton className="h-full bg-[var(--bg-secondary)]" />
              </>
            ) : (
              <div className="h-full overflow-hidden w-auto relative">
                <Image
                  src={optimizeCloudinaryUrl(item?.backgroundImage ?? "")}
                  alt={`${item?.title || "toon_central"}`}
                  width={600}
                  height={690}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    maxWidth: "100%",
                    height: "100%",
                  }}
                />
                <div className="absolute bottom-0 left-0  h-full w-full flex flex-col px-4 py-1 justify-end bg-[#0D111D70] ">
                  <div className="">
                    <div
                      className="font-bold text-[15px] uppercase cursor-pointer "
                      onClick={() => goToComic(item?.uuid)}
                    >
                      {item?.title}
                    </div>
                    <div className="flex items-center gap-[9px] ">
                      <Likes
                        likesNViews={item?.likesAndViews}
                        uid={item?.uuid}
                        queryKey={queryKey}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Fragment>
    );
  };

  return (
    <div>
      <div className="parent-wrap py-0 md:py-10 relative">
        <div className=" flex w-full flex-col child-wrap ">
          <div className="">
            <H2SectionTitle title="Popular by ToonCentral" />
          </div>
          <div className=" slider-container hidden md:block">
            <EllipseGray />

            <Slider
              ref={(slider: Slider) => {
                sliderRef.current = slider;
              }}
              {...sliderSettings}
            >
              {sliderSlides.map((slide, i) => renderSlide(slide, i))}
            </Slider>
          </div>
        </div>
      </div>
      <div className=" slider-container block md:hidden">
        {/* @ts-ignore */}
        <Slider
          ref={(slider: Slider) => {
            sliderRef.current = slider;
          }}
          {...sliderSettings}
        >
          {sliderSlides.map((slide, i) => renderSlide(slide, i))}
        </Slider>
      </div>
    </div>
  );
};

export default Popular;
