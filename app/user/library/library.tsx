"use client";
import {useState} from "react"
import { Tab, Tabs } from "@nextui-org/react";
import GenreTab from "./_shared/myBooks";
import MyBooksTab from "./_shared/myBooks";
import NotFound from "./_shared/notFound";

export default function Library() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
    tabIndex: number;
  }[] = [
    {
      id: "books",
      label: "My books",
      content: <MyBooksTab />,
      tabIndex: 0,
    },
    {
      id: "favorites",
      label: "Favourites",
      content: <></>,
      tabIndex: 1,
    },
  ];
  const handleTabChange = (key: string) => {
    const selectedTab = tabs.find((tab) => tab.id === key);
    if (selectedTab) {
      setSelectedTabIndex(selectedTab.tabIndex);
    }
  };
  return (
    <div className="parent-wrap py-10">
      <div className="child-wrap min-h-screen flex w-full flex-col gap-5">
        <Tabs
          aria-label="library_tab"
          items={tabs}
          //  onSelectionChange={(key) => setSelectedTab(key)}
          classNames={{
            tabList: "bg-[var(--bg-secondary)] px-2.5 py-2.5 ",
            tab: "text-[#FCFCFD] h-[40px]",
            base: "hidden lg:inline-flex",
            cursor:
              "w-full h-full group-data-[selected=true]:bg-[var(--bg-tab-cursor)]",
            tabContent: "px-4 py-0",
          }}
          onSelectionChange={(key) => handleTabChange(key as string)}
        >
          {tabs.map((item: any, i: number) => (
            <Tab className="p-0 capitalize" key={item?.id} title={item?.label}>
              {/* {item?.content} */}
            </Tab>
          ))}
        </Tabs>
        <div className="tab-content mt-5">
          {tabs[selectedTabIndex]?.content}
        </div>
      </div>
    </div>
  );
}
