"use client";
import React, { useState } from "react";
import ShortsSidebar from "./_components/shortsSidebar";
import ShortsContent from "./_components/shortsContent";
import ShortsHeader from "./_components/shortsHeader";

export default function ShortsClient() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState("trending");

  return (
    <div className=" bg-[var(--bg-primary)]  h-full w-full">

      <div className="h-full w-full">
        {/* <ShortsSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        /> */}

        <ShortsContent
          category={activeCategory}
          sidebarCollapsed={sidebarCollapsed}
        />
      </div>
    </div>
  );
}
