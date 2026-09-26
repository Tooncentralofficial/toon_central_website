"use client";

import { Button } from "@nextui-org/react";

interface CanvasBannerProps {
  onLearnMore?: () => void;
}

const CanvasBanner = ({ onLearnMore }: CanvasBannerProps) => {
  return (
    <section className="relative w-full overflow-hidden bg-[linear-gradient(100deg,#3C7A52_0%,#57B173_38%,#6CC488_70%,#7ACF95_100%)]">
      {/* darker wedge across the top-left corner */}
      <div
        className="pointer-events-none absolute inset-0 bg-[#123A22] opacity-25"
        style={{ clipPath: "polygon(0 0, 42% 0, 0 100%)" }}
        aria-hidden="true"
      />

      <div className="parent-wrap relative">
        <div className="child-wrap flex min-h-[320px] flex-col justify-center gap-8 py-14 md:min-h-[360px] md:flex-row md:items-center md:justify-between md:py-20">
          <div className="flex flex-col">
            <h2 className="text-[28px] md:text-[40px] font-bold leading-[1.15]">
              Making Money On
              <br />
              <span className="uppercase">Tooncentral Canvas</span>
            </h2>
            <p className="mt-6 max-w-[520px] capitalize font-bold leading-[1.7] text-[#FCFCFD]">
              Publish your work instantly and connect with a global audience. No
              gatekeepers your stories deserve to be seen.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              radius="sm"
              onPress={onLearnMore}
              className="bg-[#000000] text-[#FCFCFD] px-10 h-12"
            >
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CanvasBanner;
