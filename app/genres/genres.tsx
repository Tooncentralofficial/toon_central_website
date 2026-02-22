"use client";

import { SelectItem, Tab, Tabs } from "@nextui-org/react";
import GenreTab from "./_shared/genreTab";
import { useEffect, useState } from "react";
import { getRequest } from "../utils/queries/requests";
import { useQuery } from "@tanstack/react-query";
import SelectFilter from "../_shared/sort/selects";

export default function Genres() {
  const [genres, setGenres] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState<any>(null);
  const defaultGenre = [
    {
      id: 1,
      name: "Action",
      description: "",
      slug: "action",
      created_at: "2024-06-17T01:05:38.000000Z",
      updated_at: "2024-06-17T01:05:38.000000Z",
    },
  ];
  const { data, isError, isSuccess, isLoading, isFetching } = useQuery({
    queryKey: ["all_genres"],
    queryFn: () => getRequest("/selectables/genres"),
  });

  useEffect(() => {
    if (isSuccess) {
      setGenres(data?.data || defaultGenre);
    }
  }, [isFetching, isLoading, data]);

  const handleSelectionChange = (e: any) => {
    setSelectedTab(e.target.value);
  };
  return (
    <div className="parent-wrap py-10">
      <div className="child-wrap min-h-screen flex w-full flex-col gap-5">
        <div className="flex w-full justify-end lg:justify-center">
          <Tabs
            aria-label="genres_tab"
            items={genres}
            onSelectionChange={(key) => setSelectedTab(key)}
            classNames={{
              tabList: "bg-[var(--bg-secondary)] px-2.5 py-2.5 ",
              tab: "text-[#FCFCFD] h-[40px]",
              base: "hidden lg:inline-flex w-full overflow-x-auto",
              cursor:
                "w-full h-full group-data-[selected=true]:bg-[var(--bg-tab-cursor)]",
              tabContent: "px-4 py-0",
              // tabContent: "group-data-[selected=true]:text-[#06b6d4]"
            }}
          >
            {genres.map((item: any, i: number) => (
              <Tab
                className="p-0 capitalize"
                key={item?.id}
                title={item?.name}
              />
            ))}
          </Tabs>
          <SelectFilter
            className="lg:hidden"
            placeholder="Genres"
            selectedKeys={[selectedTab]}
            onChange={handleSelectionChange}
          >
            {genres.map((genre: any, i: number) => (
              <SelectItem key={genre?.id}>{genre?.name}</SelectItem>
            ))}
          </SelectFilter>
        </div>
        <GenreTab selectedTab={selectedTab} />
      </div>
    </div>
  );
}
