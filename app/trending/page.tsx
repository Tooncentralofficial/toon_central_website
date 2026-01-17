"use client";

import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import Image from "next/image";
import Likes from "../_shared/cards/likes";
import { SolidPrimaryButton } from "../_shared/inputs_actions/buttons";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";
import { Skeleton } from "@nextui-org/react";
import { useEffect, useState } from "react";
import TrendingItem from "./_components/trendingItem";
import Link from "next/link";

export default function Page() {
  const [newTrending, setNewTrending] = useState<any[]>([]);
  const [mostRead, setMostRead] = useState<any[]>([]);
  const {
    data: trendingComics,
    isLoading,
    isFetching,
    isSuccess,
    refetch: refetchTrending,
  } = useQuery({
    queryKey: ["new_trending"],
    queryFn: () =>
      getRequest("/trending/new-and-trending?filter=all&page=1&limit=50"),
  });

  const {
    data: readComics,
    isLoading: loadingRead,
    isFetching: fetchingRead,
    isSuccess: successRead,
  } = useQuery({
    queryKey: ["most_read"],
    queryFn: () =>
      getRequest("/trending/most-read-comics?filter=all&page=1&limit=5"),
  });

  useEffect(() => {
    if (isSuccess) {
      setNewTrending(trendingComics?.data?.comics || []);
    }
    if (successRead) {
      setMostRead(readComics?.data?.comics || []);
    }
  }, [isFetching, fetchingRead, readComics, trendingComics]);
  console.log(newTrending);
  return (
    <div>
      <div className="parent-wrap py-10">
        <div className="child-wrap w-full">
          <H2SectionTitle title="New and Trending" />

          <div className="flex gap-6 h-[320px] md:h-[500px]">
            <Link
              href={`/comics/${newTrending[0]?.uuid}`}
              className="flex w-full rounded-[8px] overflow-hidden cursor-pointer"
            >
              <div className="flex w-full h-full  overflow-hidden relative">
                <Skeleton
                  isLoaded={!isLoading}
                  className="w-full overflow-hidden h-full"
                >
                  <Image
                    src={`${newTrending[0]?.coverImage || ""}`}
                    width={200}
                    height={496}
                    alt={`${newTrending[0]?.title || "toon_central"}`}
                    style={{
                      width: "100%",
                      minHeight: "100%",
                      objectFit: "cover",
                    }}
                    unoptimized
                    priority
                  />
                  <div className="absolute top-0 left-0 outline h-full w-full flex flex-col  p-12 justify-end bg-[#0D111D70] ">
                    <div className="flex gap-7 items-center">
                      <div>
                        <div className="font-bold text-xl">
                          {newTrending[0]?.title}
                        </div>
                        <Likes likesNViews={newTrending[0]?.likesAndViews} />
                      </div>
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <SolidPrimaryButton size="md">Add</SolidPrimaryButton>
                      </div>
                    </div>
                  </div>
                </Skeleton>
              </div>
            </Link>
            <Link
              href={`/comics/${newTrending[1]?.uuid}`}
              className="w-full rounded-[8px] overflow-hidden hidden md:flex cursor-pointer"
            >
              <div className="flex w-full h-full  overflow-hidden relative">
                <Skeleton
                  isLoaded={!isLoading}
                  className="w-full overflow-hidden h-full"
                >
                  <Image
                    src={`${newTrending[1]?.coverImage || ""}`}
                    width={200}
                    height={496}
                    alt={`${newTrending[1]?.title || "toon_central"}`}
                    style={{
                      width: "100%",
                      minHeight: "100%",
                      objectFit: "cover",
                    }}
                    unoptimized
                    priority
                  />
                  <div className="absolute top-0 left-0 outline h-full w-full flex flex-col  p-12 justify-end bg-[#0D111D70] ">
                    <div className="flex gap-7 items-center">
                      <div>
                        <div className="font-bold text-xl">
                          {newTrending[1]?.title}
                        </div>
                        <Likes likesNViews={newTrending[1]?.likesAndViews} />
                      </div>
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <SolidPrimaryButton size="md">Add</SolidPrimaryButton>
                      </div>
                    </div>
                  </div>
                </Skeleton>
              </div>
            </Link>

            <div className="hidden md:flex w-full flex-col gap-5">
              <div className="rounded-lg overflow-hidden h-[50%]">
                <Link href={`/comics/${newTrending[2]?.uuid}`}>
                  <Skeleton
                    isLoaded={!isLoading}
                    className="rounded-lg overflow-hidden h-full"
                  >
                    <Image
                      src={`${newTrending[2]?.coverImage || ""}`}
                      width={200}
                      height={200}
                      alt={`${newTrending[2]?.title || "toon_central"}`}
                      objectPosition="center bottom"
                      objectFit="cover"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                      unoptimized
                      priority
                    />
                  </Skeleton>
                </Link>
              </div>
              <div className="rounded-lg overflow-hidden h-[50%]">
                <Link href={`/comics/${newTrending[3]?.uuid}`}>
                  <Skeleton
                    isLoaded={!isLoading}
                    className="rounded-lg overflow-hidden h-full"
                  >
                    <Image
                      src={`${
                        newTrending[3]?.coverImage ||
                        newTrending[4]?.coverImage ||
                        ""
                      }`}
                      width={200}
                      height={200}
                      alt={`${newTrending[3]?.title || "toon_central"}`}
                      style={{
                        objectPosition: "center bottom",
                        objectFit: "cover",
                        width: "100%",
                        maxWidth: "100%",
                        height: "100%",
                        transform: "rotate(180deg)",
                      }}
                      unoptimized
                      priority
                    />
                  </Skeleton>
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {isLoading || newTrending.length == 0 ? (
              <Skeleton className="w-full h-[60px]"></Skeleton>
            ) : (
              newTrending.map((item, i) => (
                <TrendingItem
                  key={i}
                  data={item}
                  refetchTrending={refetchTrending}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <div className="parent-wrap py-10">
        <div className="child-wrap w-full">
          <H2SectionTitle title="Most Read Comics" />
          <div className="flex flex-col lg:flex-row gap-6">
            <Link
              href={`/comics/${mostRead[0]?.uuid}`}
              className="flex w-full h-[320px] md:h-[500px] rounded-[8px] overflow-hidden cursor-pointer"
            >
              <div className="flex w-full h-full  overflow-hidden relative">
                <Skeleton
                  isLoaded={!loadingRead}
                  className="w-full overflow-hidden h-full"
                >
                  <Image
                    src={`${mostRead[0]?.coverImage || ""}`}
                    width={200}
                    height={496}
                    alt={`${mostRead[0]?.title || "toon_central"}`}
                    style={{
                      width: "100%",
                      minHeight: "100%",
                      objectFit: "cover",
                    }}
                    unoptimized
                    priority
                  />
                  <div className="absolute top-0 left-0 outline h-full w-full flex flex-col  p-12 justify-end bg-[#0D111D70] ">
                    <div className="flex gap-7 items-center">
                      <div>
                        <div className="font-bold text-xl">
                          {mostRead[0]?.title}
                        </div>
                        <Likes likesNViews={mostRead[0]?.likesAndViews} />
                      </div>
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <SolidPrimaryButton size="md">Add</SolidPrimaryButton>
                      </div>
                    </div>
                  </div>
                </Skeleton>
              </div>
            </Link>
            <Link
              href={`/comics/${mostRead[1]?.uuid}`}
              className="flex w-full h-[320px] md:h-[500px] rounded-[8px] overflow-hidden cursor-pointer"
            >
              <div className="flex w-full h-full  overflow-hidden relative">
                <Skeleton
                  isLoaded={!loadingRead}
                  className="w-full overflow-hidden h-full"
                >
                  <Image
                    src={`${mostRead[1]?.coverImage || ""}`}
                    width={200}
                    height={496}
                    alt={`${mostRead[1]?.title || "toon_central"}`}
                    style={{
                      width: "100%",
                      minHeight: "100%",
                      objectFit: "cover",
                    }}
                    unoptimized
                    priority
                  />
                  <div className="absolute top-0 left-0 outline h-full w-full flex flex-col  p-12 justify-end bg-[#0D111D70] ">
                    <div className="flex gap-7 items-center">
                      <div>
                        <div className="font-bold text-xl">
                          {mostRead[1]?.title}
                        </div>
                        <Likes likesNViews={mostRead[1]?.likesAndViews} />
                      </div>
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <SolidPrimaryButton size="md">Add</SolidPrimaryButton>
                      </div>
                    </div>
                  </div>
                </Skeleton>
              </div>
            </Link>
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
              {loadingRead || mostRead.length == 0 ? (
                <Skeleton className="w-full h-[60px]"></Skeleton>
              ) : (
                mostRead.map((item, i) => (
                  <TrendingItem
                    key={i}
                    data={item}
                    refetchTrending={refetchTrending}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
