"use client";
import React, { useEffect, useState } from "react";
import { Tabs, Tab, SelectItem } from "@nextui-org/react";
import TopRecommendations from "./topRecommendations";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";
import { Filters, SelectFilters } from "../_shared/sort/filters";
import SelectFilter from "../_shared/sort/selects";
import SelectFilterClone from "../_shared/sort/selectclone";
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
    isError: genresError,
    isSuccess: genresSuccess,
    isLoading: genresLoading,
    isFetching: genresFetching,
  } = useQuery({
    queryKey: ["all_genres"],
    queryFn: () => getRequest("/genres/pull/list"),
  });

  const [recommended, setRecommended] = useState([]);
  const [filter, setFilter] = useState<Filters>("all");
  const { data, isError, isSuccess, isLoading, isFetching } = useQuery({
    queryKey: ["top_recommended", filter],
    queryFn: () =>
      getRequest(`/home/top-recommendations?filter=${filter}&page=1&limit=10`),
  });

  useEffect(() => {
    if (isSuccess) {
      setRecommended(data?.data?.comics || []);
    }
  }, [isFetching, isLoading, data]);
  const tabs: { id: Filters; label: string; content: React.ReactNode }[] = [
    {
      id: "all",
      label: "Top recommendations",
      content: (
        <TopRecommendations
          isLoading={isLoading}
          isFetching={isFetching}
          data={recommended}
        />
      ),
    },
    {
      id: "weekly",
      label: "Weekly picks",
      content: (
        <TopRecommendations
          isLoading={isLoading}
          isFetching={isFetching}
          data={recommended}
        />
      ),
    },
    {
      id: "new",
      label: "New releases",
      content: (
        <TopRecommendations
          isLoading={isLoading}
          isFetching={isFetching}
          data={recommended}
        />
      ),
    },
    {
      id: "recent",
      label: "Recent updates",
      content: (
        <TopRecommendations
          isLoading={isLoading}
          isFetching={isFetching}
          data={recommended}
        />
      ),
    },
  ];
  const handleSelectionChange = (e: any) => {
    setFilter(e.target.value);
  };
  return (
    <div className="parent-wrap py-10">
      <div className="child-wrap min-h-[520px] flex w-full flex-col relative">
        <div className="lg:absolute lg:top-[10px] lg:right-[80px] lg:w-32 hidden lg:flex justify-end items-center w-full gap-5 ">
          <SelectFilter
            className="lg:hidden"
            placeholder="Genres"
            selectedKeys={[filter]}
            onChange={handleSelectionChange}
          >
            {tabs.map((tab, i) => (
              <SelectItem key={tab?.id}>{tab?.label}</SelectItem>
            ))}
          </SelectFilter>
        </div>
        <H2SectionTitle title="Top recommendedd" />
        {/* <Tabs
          aria-label="Dynamic tabs"
          items={tabs}
          onSelectionChange={(tab: any) => {
            setFilter(tab);
          }}
          classNames={{
            tabList: "bg-[var(--bg-secondary)] px-2.5 py-2.5 ",
            tab: "text-[var(--text-primary)] h-[40px]",
            base: "hidden lg:inline-flex",
            cursor:
              "w-full h-full group-data-[selected=true]:bg-[var(--bg-tab-cursor)] group-data-[selected=true]:text-[var(--text-primary)]",
            tabContent: "px-4 py-0",
          }}
        >
          {(item) => (
            <Tab className="p-0" key={item.id} title={item.label}>
              <div className="py-5">{item.content}</div>
            </Tab>
          )}
        </Tabs> */}
        {genresSuccess && genres?.data?.length > 0 && (
          <GenreTabs
            tabs={genres?.data}
            children={(activeTab) => <GenreTabContent activeTab={activeTab} />}
          />
        )}
      </div>
    </div>
  );
}
// <TopRecommendations isLoading={isLoading} isFetching={isFetching} data={recommended} />}
