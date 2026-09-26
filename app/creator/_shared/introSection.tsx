"use client";

import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { Steps3 } from "@/app/_shared/icons/icons";
import AboutSection from "./aboutSection";
import CanvasBanner from "./canvasBanner";
import StepsSection from "./stepsSection";
import SpecialOffers from "./specialOffers";

interface IntroSectionProps {
  onLearnMore?: () => void;
}

const IntroSection = ({ onLearnMore }: IntroSectionProps) => {
  const { token } = useSelector(selectAuthState);
  const tokenState = token === undefined;

  return (
    <div>
      <div className="parent-wrap pt-10">
        <div className="child-wrap flex w-full flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#4ADD80]">Share Without Limits</h1>
          <h2 className="text-2xl md:text-3xl">Endless Comics, Endless stories.</h2>
          <p className="mt-4 max-w-[560px]">
            Read Anywhere. Create Anytime. Get started with us to unlock a world
            of comics and creativity
          </p>
          <div className="hidden md:flex gap-5 mt-8">
            <Button
              as={Link}
              href="/auth/signup"
              radius="sm"
              className="bg-[var(--green100)]"
            >
              Get Started
            </Button>
            <Button
              as={Link}
              radius="sm"
              className="bg-[var(--gray100)]"
              href={tokenState ? "/auth/signup" : "/creator/new"}
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="parent-wrap pb-10 mt-8">
        <div className="max-w-[1536px] md:px-6 flex w-full flex-col items-center gap-6">
          <div className="w-full overflow-hidden">
            <Image
              src={`/static/images/creators.svg`}
              width={200}
              height={200}
              alt={"creators"}
              style={{
                objectFit: "cover",
                minHeight: "160px",
                width: "100%",
              }}
              priority
            />
          </div>
          <div className="flex md:hidden gap-5">
            <Button
              radius="sm"
              className="bg-[var(--green100)]"
              as={Link}
              href="/auth/signup"
            >
              Get Started
            </Button>
            <Button
              radius="sm"
              className="bg-[var(--gray100)]"
              as={Link}
              href={tokenState ? "/auth/signup" : "/creator/new"}
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      <AboutSection />

      <CanvasBanner onLearnMore={onLearnMore} />

      <StepsSection />

      <SpecialOffers />

      {/* <div className="parent-wrap py-10">
        <div className="child-wrap relative flex w-full flex-col items-center">
          <div className="mt-[150px] sm:mt-[120px] md:mt-[60px] lg:mt-[unset] "></div>
          <Steps3 />
          <div className="absolute top-0 right-0 flex flex-col gap-2 px-6">
            <h2 className="text-2xl">How it works </h2>
            <p className=" max-w-[300px] font-bold text-[#969AA0]">
              Start publishing on Toon Central with the following steps
            </p>
            <div className="w-min">
              <Button
                radius="sm"
                className="bg-[var(--green100)]"
                as={Link}
                href="/creator/dashboard"
              >
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default IntroSection;
