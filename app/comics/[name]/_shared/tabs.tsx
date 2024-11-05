"use client";
import React from "react";
import { Skeleton, Tab, Tabs } from "@nextui-org/react";
import Chapters from "./tabItems/chapters";
import Comments from "./tabItems/comments";
import { ViewComicProps } from "../pageClient";

export interface ComicTab{
  uid:any
  data:any
}
const ComicTabs = ({uid, data, isLoading }: ViewComicProps) => {
  const tabs = [
    {
      id: "chapters",
      label: "Chapters",
      content: <Chapters uid={uid} data={data} />,
    },
    {
      id: "comments",
      label: "comments",
      content: <Comments uid={uid} data={data} />,
    },
  ];
  return (
    <Skeleton
      isLoaded={data !== null}
      className={`${
        data == null && "h-[300px]"
      } bg-secondary my-10 rounded-lg `}
    >
      <div className="bg-secondary my-10 p-4 lg:p-9 rounded-lg ">
        <div className="flex w-full flex-col">
          <Tabs
            aria-label="Options"
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

export default ComicTabs;
