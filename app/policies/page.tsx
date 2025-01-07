"use client";
import { Tab, Tabs } from "@nextui-org/react";
import MyBooksTab from "../user/library/_shared/myBooks";
import MyFavourites from "../user/library/_shared/favourites";
import { useState } from "react";
import Policies from "./_shared/tabs/policies";
import Cookiepolicies from "./_shared/tabs/cookiepolicy";
import DMCApolicy from "./_shared/tabs/dmcapolicy";
import GDPRPolicy from "./_shared/tabs/gdprpolicy";
import Copyrightpolicy from "./_shared/tabs/copyrightpolicy";
import Returnpolicy from "./_shared/tabs/returnpolicy";
import Disclamer from "./_shared/tabs/disclamer";

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
      label: "Privacy policy",
      content: <Policies />,
      tabIndex: 0,
    },
    {
      id: "cookiepolicy",
      label: "Cookie policy",
      content: <Cookiepolicies />,
      tabIndex: 1,
    },
    {
      id: "dmcapolicy",
      label: "DMCA policy",
      content: <DMCApolicy />,
      tabIndex: 2,
    },
    {
      id: "gdprpolicy",
      label: "GDPRPolicy",
      content: <GDPRPolicy />,
      tabIndex: 3,
    },
    {
      id: "copyrightpolicy",
      label: "Copyright policy",
      content: <Copyrightpolicy/>,
      tabIndex: 4,
    },
    {
      id: "returnpolicy",
      label: "Return policy",
      content: <Returnpolicy/>,
      tabIndex: 5,
    },
    {
      id: "disclamer",
      label: "Disclamer",
      content: <Disclamer/>,
      tabIndex: 6,
    }
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
