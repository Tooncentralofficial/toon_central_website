"use client";

import Likes from "@/app/_shared/cards/likes";
import { GreenUser, SearchIcon, ShareIcon } from "@/app/_shared/icons/icons";
import { Button, Skeleton, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ViewComicProps } from "../pageClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { parseArray } from "@/helpers/parsArray";
import { ComicGenre } from "@/app/trending/_components/trendingItem";
import SearchModal from "@/app/_shared/layout/search";
import ShareModal from "@/app/_shared/modals/shareModal";

const ComicOverview = ({ uid, data, isLoading, queryKey }: ViewComicProps) => {
  const { onClose, onOpen, isOpen, onOpenChange } = useDisclosure();
  const disabled = useMemo(() => data?.episodes?.length <= 0, [data]);
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();
  const comicId = data?.id
  const { user, token } = useSelector(selectAuthState);
  const readChapter = () =>
    router.push(`${pathname}/chapter?chapter=${0}&uid=${uid}&comicid=${comicId}`);

  const { mutate: likeComic, isPending } = useMutation({
    mutationKey: ["like"],
    mutationFn: () =>
      getRequestProtected(`/comics/${uid}/like`, token, pathname),
    onSuccess: (data) => {
      if (data?.success) {
        toast(
          data?.message === "you have successfully liked this comic"
            ? "subscribed"
            : "unsubscribed",
          {
            toastId: `toast_${uid}`,
            type: "success",
          }
        );
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        });
        return;
      }
      toast(data?.message === "you have successfully liked this comic" ? "subscribed" : "unsubscribed", {
        toastId: `toast_${uid}`,
        type: "error",
      });
    },
    onError(error, variables, context) {
      toast("Failed to like", {
        toastId: `toast_${uid}`,
        type: "error",
      });
    },
  });

  const subscribe = () => {
    likeComic();
  };
  const subscribed = useMemo(() => {
    return parseArray(data?.likesAndViews?.likes).some((value) => {
      return value?.user_id === user?.id;
    });
  }, [user,data]);
  return (
    <Skeleton
      isLoaded={data !== null}
      className={`${
        data == null && "h-[300px]"
      } bg-secondary my-10 rounded-lg `}
    >
      <div className="bg-secondary p-4 lg:p-9 rounded-lg ">
        <div className="flex gap-6">
          <div className="w-[20%] h-[120px] md:h-[240px] min-w-[120px] max-w-[240px] rounded-lg overflow-hidden">
            <Image
              src={`${data?.coverImage || ""}`}
              alt={`${data?.title || "toon_central"}`}
              width={200}
              height={240}
              style={{
                objectFit: "cover",
                maxWidth: "100%",
                width: "100%",
                height: "100%",
              }}
              unoptimized
            />
          </div>
          <div className="w-[80%] ">
            <p className="text-[1.5rem] font-semibold lg:text-4xl uppercase">
              {data?.title}
            </p>
            <div className="py-3">
              <Likes
                likesNViews={data?.likesAndViews}
                queryKey={queryKey}
                uid={data?.uuid}
                favourites={data?.favourites}
              />
            </div>

            <div className="flex flex-col mt-1 lg:flex-row lg:w-[70%]  gap-2 justify-between ">
              {data?.publishedByToonCentral === 1 ? (
                <div className="flex gap-4">
                  <span>ToonCentral</span> <GreenUser />
                </div>
              ) : (
                <div className="flex gap-4">
                  <span>{data?.user.username}</span>
                  <GreenUser />
                </div>
              )}
              <span className="flex flex-wrap text-[0.6rem] md:text-[0.9rem] gap-2">
                {data?.genres.map((item: ComicGenre, i: number) => (
                  <p
                    key={i}
                    className={`text-[#FCFCFD] text-[1] ${
                      i < data.genres.length - 1 && "mr-1"
                    }`}
                  >
                    {item.genre.name}
                    {i < data.genres.length - 1 && ","}
                  </p>
                ))}
              </span>
              <span className="flex gap-4 cursor-pointer " onClick={onOpen}>
                <ShareIcon /> <p>share </p>
              </span>
            </div>
            <div className="hidden lg:block pt-8 text-size-1">
              <p className="text-gray underline">Episode Update Bi-weekly</p>
              <p className="text-gray ">{data?.description}</p>
            </div>
          </div>
        </div>
        <div className="block lg:hidden pt-8 text-lg">
          <p className="text-gray underline">Episode Update Bi-weekly</p>
          <p className="text-gray">{data?.description}</p>
        </div>

        <div className="pt-8  flex gap-6">
          <div className="hidden lg:block w-[20%] max-w-[240px]"></div>
          <div className="  flex w-full lg:w-[80%] gap-4">
            <Button
              disabled={disabled}
              onClick={readChapter}
              radius="sm"
              className={`${
                disabled ? "bg-[#475467]" : "bg-[var(--green100)]"
              }`}
            >
              Read First Chapter
            </Button>

            <Button
              isLoading={isPending}
              onPress={subscribe}
              radius="sm"
              className="bg-[#475467]"
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </Button>
          </div>
        </div>
        <ShareModal
          isOpen={isOpen}
          onClose={onClose}
          onOpenChange={onOpenChange}
          comicImageUrl={data?.coverImage}
        />
      </div>
    </Skeleton>
  );
};

export default ComicOverview;
