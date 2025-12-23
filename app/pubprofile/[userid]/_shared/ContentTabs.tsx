"use client";

import React from "react";
import { Skeleton, Tab, Tabs } from "@nextui-org/react";
import ComicsGrid from "./ComicsGrid";
import ShortsGrid from "./ShortsGrid";

interface ContentTabsProps {
  data: any;
  isLoading: boolean;
  userid: string;
}

const ContentTabs = ({ data, isLoading, userid }: ContentTabsProps) => {
  const tabs = [
    {
      id: "comics",
      label: "Comics",
      content: <ComicsGrid comics={data?.comics || []} isLoading={isLoading} />,
    },
    {
      id: "shorts",
      label: "Shorts",
      content: <ShortsGrid shorts={data?.shorts || []} isLoading={isLoading} />,
    },
  ];

  return (
    <Skeleton
      isLoaded={!isLoading && data !== null}
      className={`${
        (isLoading || data == null) && "h-[300px]"
      } bg-secondary my-10 rounded-lg`}
    >
      <div className="bg-secondary my-10 p-4 lg:p-9 rounded-lg">
        <div className="flex w-full flex-col">
          <Tabs
            aria-label="Creator Content"
            color="primary"
            variant="underlined"
            items={tabs}
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-[var(--green100)]",
              tab: "max-w-fit px-0 h-12",
              tabContent:
                "capitalize text-lg font-semibold group-data-[selected=true]:text-[#ffffff]",
            }}
          >
            {(item) => (
              <Tab className="p-0" key={item.id} title={item.label}>
                <div className="py-5">{item.content}</div>
              </Tab>
            )}
          </Tabs>
        </div>
      </div>
    </Skeleton>
  );
};

export default ContentTabs;
