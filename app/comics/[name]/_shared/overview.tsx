"use client";

import Likes from "@/app/_shared/cards/likes";
import { GreenUser } from "@/app/_shared/icons/icons";
import { Button, Skeleton } from "@nextui-org/react";
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

const ComicOverview = ({ uid, data, isLoading, queryKey }: ViewComicProps) => {
  const disabled = useMemo(() => data?.episodes?.length <= 0, [data]);
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();
  const { user, token } = useSelector(selectAuthState);
  const readChapter = () =>
    router.push(`${pathname}/chapter?chapter=${0}&uid=${uid}`);

  const { mutate: likeComic, isPending } = useMutation({
    mutationKey: ["like"],
    mutationFn: () =>
      getRequestProtected(`/comics/${uid}/like`, token, pathname),
    onSuccess: (data) => {
      if (data?.success) {
        toast(data?.message, {
          toastId: `toast_${uid}`,
          type: "success",
        });
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        });
        return;
      }
      toast(data?.message, {
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
            <p className="text-2xl font-semibold lg:text-4xl uppercase">
              {data?.title}
            </p>
            <div className="py-3">
              <Likes likesNViews={data?.likesAndViews} />
            </div>

            <div className="flex flex-col lg:flex-row lg:w-[60%] justify-between gap-2">
              {data?.publishedByToonCentral === 1 && (
                <div className="flex gap-4">
                  <span>ToonCentral</span> <GreenUser />
                </div>
              )}

              <span>{data?.genre?.name}</span>
            </div>
            <div className="hidden lg:block pt-8 text-lg">
              <p className="text-gray underline">Episode Update Bi-weekly</p>
              <p className="text-gray">{data?.description}</p>
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
      </div>
    </Skeleton>
  );
};

export default ComicOverview;
