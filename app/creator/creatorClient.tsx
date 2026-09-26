"use client";

import { useState } from "react";
import Footer from "../_shared/layout/footer";
import CreatorTabs, { creatorTabs } from "./_shared/creatorTabs";
import IntroSection from "./_shared/introSection";
import ComingSoonSection from "./_shared/comingSoonSection";
import MakingMoneySection from "./_shared/makingMoneySection";

const CreatorClient = () => {
  const [activeTab, setActiveTab] = useState(creatorTabs[0].id);

  const renderSection = () => {
    switch (activeTab) {
      case "introduction":
        return <IntroSection onLearnMore={() => setActiveTab("making-money")} />;
      case "making-money":
        return <MakingMoneySection />;
      default:
        return (
          <ComingSoonSection
            title={
              creatorTabs.find((tab) => tab.id === activeTab)?.label ?? ""
            }
          />
        );
    }
  };

  return (
    <div>
      <div className="parent-wrap pt-6">
        <div className="child-wrap">
          <CreatorTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>
      {renderSection()}
      <Footer />
    </div>
  );
};

export default CreatorClient;
