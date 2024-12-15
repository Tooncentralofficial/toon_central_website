"use client";
import { Tab, Tabs } from "@nextui-org/react";
import MyBooksTab from "../user/library/_shared/myBooks";
import MyFavourites from "../user/library/_shared/favourites";
import { useState } from "react";
import Policies from "./_shared/tabs/policies";

export default function Page() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
    tabIndex: number;
  }[] = [
    {
      id: "polices",
      label: "Polices",
      content: <Policies />,
      tabIndex: 0,
    },
    {
      id: "favorites",
      label: "Favourites",
      content: <MyFavourites />,
      tabIndex: 1,
    },
    {
      id: "continue_reading",
      label: "Continue Reading",
      content: <MyFavourites />,
      tabIndex: 2,
    },
    {
      id: "subscribtion",
      label: "Subscription",
      content: <MyFavourites />,
      tabIndex: 3,
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
      <div className="child-wrap">
        <Tabs
          aria-label="polices_tab"
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
