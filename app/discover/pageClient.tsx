"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getRequest } from "../utils/queries/requests";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import { Skeleton } from "@nextui-org/react";
import TrendingItem from "../trending/_components/trendingItem";
import DiscoverItems from "./_components/discoverItems";
import Link from "next/link";
import { useRouter } from "next/navigation";

function DiscoverClientPage() {
  const discoverQueryKey = "discover_trending";
  const router = useRouter();
  const { data, isError, isSuccess, isLoading, isFetching } = useQuery({
    queryKey: [discoverQueryKey],
    queryFn: () =>
      getRequest("/trending/new-and-trending?filter=all&page=1&limit=50"),
  });
  const comics = data?.data?.comics || [];
  const [subscribedComics, setSubscribedComics] = useState<number[]>([]);
  const toggleSubscribe = (comicId: number) => {
    setSubscribedComics((prev) =>
      prev.includes(comicId)
        ? prev.filter((id) => id !== comicId)
        : [...prev, comicId]
    );
  };

  const allSubscribed =
    comics.length > 0 && subscribedComics.length === comics.length;

  const toggleAll = () => {
    if (allSubscribed) {
      setSubscribedComics([]);
    } else {
      setSubscribedComics(comics.map((comic: any) => comic.id));
    }
  };

  console.log("Client fetched all_genres data", data);
  return (
    <div className="auth-container  p-2 sm:p-5  md:p-10">
      <div className="child-wrap max-h-screen flex w-full flex-col gap-5 px-2 sm:px-[1rem] md:px-[5rem] lg:px-[10rem]">
        <div className="flex flex-col gap-[18px] bg-[var(--bg-secondary)] rounded-[8px] px-2 sm:px-6 py-6 lg:px-9 lg:py-5 h-full break-all ">
          <H2SectionTitle title="Discover Trending Comics"></H2SectionTitle>
          <div className=" flex justify-end">
            <aside className="px-6 w-[6rem]">
              <button
                onClick={() => router.push("/")}
                className={`w-full text-white font-semibold  py-1 rounded-sm hover:opacity-90 transition-colors text-xs
                 bg-gradient-to-r from-[#DC2626] to-[#EF4444]`}
              >
                Skip
              </button>
            </aside>
          </div>
          <div>
            <div className=" w-full rounded-[8px] overflow-hidden flex md:flex">
              <div className="flex w-full h-full  overflow-hidden relative">
                <div className="px-2 md:px-6 pb-3 w-full flex flex-col gap-1 h-full overflow-y-auto">
                  {isLoading || isFetching || comics.length === 0
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton
                          key={i}
                          className="w-full h-[60px] mt-8 rounded-md"
                        ></Skeleton>
                      ))
                    : comics
                        ?.slice(0, 4)
                        .map((item: any, i: number) => (
                          <DiscoverItems
                            key={i}
                            data={item}
                            isSubscribed={subscribedComics.includes(item.id)}
                            onToggleSubscribe={() => toggleSubscribe(item.id)}
                            queryKey={discoverQueryKey}
                          />
                        ))}
                </div>
              </div>{" "}
            </div>
            <div className=" flex justify-center">
              <aside className="px-6 w-[20rem]">
                <button
                  onClick={toggleAll}
                  className={`w-full text-white font-semibold  py-3 rounded-md hover:opacity-90 transition-colors ${
                    allSubscribed
                      ? "bg-gradient-to-r from-[#DC2626] to-[#EF4444]"
                      : "bg-gradient-to-r from-[#16A34A] to-[#38C172]"
                  }`}
                >
                  {allSubscribed ? "Unsubscribe All" : "Subscribe to All"}
                </button>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscoverClientPage;
