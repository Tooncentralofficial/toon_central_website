"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { getRequest } from "../utils/queries/requests";
import { dummyItems } from "./data";
import LoadingTitleTop from "./cards/loadingTitleTop";
import CardTitleOutside from "./cards/cardTitleOutside";
interface Tab {
  id: number;
  name: string;
  slug: string;
  description: string;
  updatedAt: string;
  createdAt: string;
}

interface GenreTabsProps {
  tabs: Tab[];
  children: (activeTab: Tab) => React.ReactNode;
}
function GenreTabs({ tabs, children }: GenreTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>(tabs?.[0]);

  // Update activeTab when tabs prop changes and activeTab is no longer valid
  useEffect(() => {
    if (tabs && tabs.length > 0) {
      const currentTabExists = tabs.find((t) => t.id === activeTab?.id);
      if (!currentTabExists) {
        setActiveTab(tabs[0]);
      }
    }
  }, [tabs, activeTab?.id]);

  return (
    <div className="w-full">
      {/* Tabs Container */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pb-6">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab)}
              className={`
                px-6 py-3 rounded-full font-medium text-sm whitespace-nowrap transition-all
                ${
                  activeTab?.id === tab?.id
                    ? "bg-[#4ADD80] text-[#000000] hover:bg-slate-600"
                    : "bg-[#475467] text-white hover:bg-slate-600"
                }
              `}
            >
              {tab?.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">{children(activeTab)}</div>
    </div>
  );
}

export const GenreTabContent = ({ activeTab }: { activeTab: Tab }) => {
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [`genre_${activeTab.id}`, activeTab.id],
    queryFn: () => getRequest(`/genres/comic/${activeTab.id}/all`),
    enabled: activeTab !== null && activeTab.id !== undefined,
  });
  const comics = useMemo(() => data?.data?.comics || [], [data]);

  return (
    <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
      {isLoading ? (
        dummyItems.map((item, i) => <LoadingTitleTop key={i} />)
      ) : (
        <>
          {comics?.length > 0 ? (
            <>
              {comics?.map((item: any, i: number) => (
                <div key={i}>
                  <div className="">
                    <CardTitleOutside cardData={item} index={i} />
                  </div>
                </div>
              ))}
            </>
          ) : (
            dummyItems.map((item, i) => <LoadingTitleTop key={i} />)
          )}
        </>
      )}
    </div>
  );
};
export default GenreTabs;
