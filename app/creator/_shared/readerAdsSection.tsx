"use client";

import QualifyCards from "./qualifyCards";

const qualifications = [
  { id: "subscribers", text: "Series with total of 1,000 subscribers or higher." },
  { id: "views", text: "Reach 40,000 monthly global page views or more." },
];

const ReaderAdsSection = () => {
  return (
    <div className="parent-wrap pb-14 md:pb-20">
      <div className="child-wrap flex w-full flex-col items-center text-center">
        <h2 className="text-2xl md:text-[32px] font-bold leading-tight underline decoration-[#4A7DFF] decoration-[3px] underline-offset-[6px]">
          Reader Ads
        </h2>
        <p className="mt-6 max-w-[760px] capitalize text-sm md:text-lg leading-[1.9] text-[#FCFCFD]">
          Reader ads are banner ads that appear at the bottom of your episodes.
          Creators earn revenue based on their series&apos; contribution to the
          total ad pool
        </p>

        <div className="mt-14 md:mt-20 flex w-full flex-col items-center">
          <QualifyCards title="To Qualify For Reader Ads:" items={qualifications} />
        </div>
      </div>
    </div>
  );
};

export default ReaderAdsSection;
