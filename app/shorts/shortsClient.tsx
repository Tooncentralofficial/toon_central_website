"use client";
import React, { useEffect, useState } from "react";
import ShortsSidebar from "./_components/shortsSidebar";
import ShortsContent from "./_components/shortsContent";
import ShortsHeader from "./_components/shortsHeader";

export default function ShortsClient() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [activeCategory, setActiveCategory] = useState("trending");

  useEffect(()=>{
    setTimeout(()=>setShowPage(true),600)
    
  },[])

  

  return (
    <div className=" bg-[var(--bg-primary)] h-full md:h-[90vh] lg:h-[83vh] xl:h-full w-full ">

      <div className="h-full w-full overflow-hidden">
        {/* <ShortsSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        /> */}
        {
          showPage && (
            <ShortsContent />
          )
        }

        
      </div>
    </div>
  );
}
