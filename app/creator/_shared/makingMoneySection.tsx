"use client";

import Image from "next/image";
import JoinStepsSection from "./joinStepsSection";
import AdRevenueSection from "./adRevenueSection";
import ReaderAdsSection from "./readerAdsSection";
import RewardAdsSection from "./rewardAdsSection";

/**
 * Referenced by public path, not imported: next.config.mjs runs @svgr/webpack
 * over svg imports from .tsx, which returns a component instead of a url.
 * Both files are pre-cropped by their viewBox to sit against the page edge.
 */
const art = {
  left: { src: "/static/creator101/coins/left.svg", ratio: "315 / 233" },
  right: { src: "/static/creator101/coins/right.svg", ratio: "310 / 233" },
};

const SideArt = ({ side }: { side: "left" | "right" }) => {
  const { src, ratio } = art[side];
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-0 w-[120px] md:w-[170px] lg:w-[240px] xl:w-[280px] ${
        side === "left" ? "left-0" : "right-0"
      }`}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 120px, (max-width: 1024px) 170px, 280px"
        style={{ objectFit: "contain", objectPosition: "bottom" }}
      />
    </div>
  );
};

const MoneyBanner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#5B4AE8]">
      <SideArt side="left" />
      <SideArt side="right" />

      {/* the inset lives here, not on child-wrap: `.parent-wrap > .child-wrap`
          is a two-class selector and outranks tailwind's padding utilities */}
      <div className="parent-wrap relative">
        <div className="child-wrap">
          <div className="flex flex-col items-center pt-12 pb-[110px] text-center md:px-[180px] md:py-16 lg:px-[270px] xl:px-[310px]">
            <h2 className="text-2xl md:text-[38px] font-bold leading-tight">
              <span className="text-[#4ADD80]">Make Money</span> With{" "}
              <span className="uppercase">Tooncentral</span>
            </h2>
            <p className="mt-5 max-w-[620px] capitalize text-sm md:text-base leading-[1.9] text-[#FCFCFD]">
              Earn money by sharing your story with a global audience. Creators
              can monetize through the Super Like program, the Ad Revenue
              Sharing program, and Patreon integration
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const MakingMoneySection = () => {
  return (
    <div>
      <MoneyBanner />
      <JoinStepsSection />
      <AdRevenueSection />
      <ReaderAdsSection />
      <RewardAdsSection />
    </div>
  );
};

export default MakingMoneySection;
