"use client";

import { Tab, Tabs } from "@nextui-org/react";
import DetailsTab from "./tabs/details";
import SecurityTab from "./tabs/security";

export default function Page() {
  const tabs: { id: string; label: string; content: React.ReactNode }[] = [
    {
      id: "details",
      label: "Details",
      content: <DetailsTab />,
    },
    {
      id: "security",
      label: "Security",
      content: <SecurityTab />,
    },
  ];
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
            cursor: "w-full h-full group-data-[selected=true]:bg-[var(--bg-tab-cursor)]",
            tabContent: "px-4 py-0",
          }}
        >
          {tabs.map((item: any, i: number) => (
            <Tab className="p-0 capitalize" key={item?.id} title={item?.label}>
              {item?.content}
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
