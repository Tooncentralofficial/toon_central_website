"use client";
import React from "react";
import { Skeleton } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import GenreTabs, { GenreTabContent } from "../_shared/genre_tabs";

export interface RecommendedTabProps {
  isLoading: boolean;
  isFetching: boolean;
  data: any;
}
export default function RecommendtnTabs() {
  const {
    data: genres,
    isSuccess: genresSuccess,
    isLoading: genresLoading,
  } = useQuery({
    queryKey: ["all_genres"],
    queryFn: () => getRequest("/selectables/genres"),
  });
  return (
    <div className="parent-wrap py-10">
      <div className="child-wrap min-h-[520px] flex w-full flex-col relative">
        <H2SectionTitle title="Top recommended" />
        {genresLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        ) : genresSuccess && genres?.data?.length > 0 ? (
          <GenreTabs tabs={genres.data}>
            {(activeTab) => <GenreTabContent activeTab={activeTab} />}
          </GenreTabs>
        ) : null}
      </div>
    </div>
  );
}
